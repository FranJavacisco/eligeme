import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pregunta, TipoPregunta, RespuestaCuestionario } from '../../types/cuestionario.types';
import { CategoriaProducto, FiltrosRecomendacion } from '../../types/producto.types';
import { useAppContext } from '../../context/AppContext';
import { useProductosContext } from '../../context/ProductosContext';
import { PasoApp } from '../../types/app.types';
import Button from '../common/Button';
import PreguntaItem from './PreguntaItem';
import IndicadorProgreso from './IndicadorProgreso';
import { obtenerPreguntas } from '../../services/api';

const Cuestionario: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useAppContext();
    const { filtrarProductos } = useProductosContext();

    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [preguntaActual, setPreguntaActual] = useState<number>(0);
    const [cargando, setCargando] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar preguntas del cuestionario
    useEffect(() => {
        const cargarPreguntas = async () => {
            try {
                setCargando(true);
                setError(null);

                // En un entorno real, obtendríamos las preguntas del backend
                // Para este ejemplo, usamos preguntas simuladas
                const preguntasObtenidas = await obtenerPreguntasSimuladas();

                // Ordenar preguntas por orden de presentación
                const preguntasOrdenadas = preguntasObtenidas.sort(
                    (a, b) => a.ordenPresentacion - b.ordenPresentacion
                );

                setPreguntas(preguntasOrdenadas);
            } catch (err) {
                setError('Error al cargar las preguntas. Por favor, intenta nuevamente.');
                console.error('Error al cargar preguntas:', err);
            } finally {
                setCargando(false);
            }
        };

        cargarPreguntas();
    }, []);

    // Determinar qué preguntas mostrar basadas en respuestas anteriores
    const preguntasMostradas = preguntas.filter((pregunta) => {
        // Si la pregunta no depende de otra, siempre se muestra
        if (!pregunta.dependeDe) return true;

        // Buscar la respuesta a la pregunta de la que depende
        const respuestaDependencia = state.respuestas.find(
            (r) => r.preguntaId === pregunta.dependeDe?.preguntaId
        );

        // Si no hay respuesta a la pregunta de la que depende, no se muestra
        if (!respuestaDependencia) return false;

        // Verificar si la respuesta coincide con el valor esperado
        const { valorEsperado } = pregunta.dependeDe;

        if (Array.isArray(valorEsperado)) {
            // Si esperamos múltiples valores posibles
            if (Array.isArray(respuestaDependencia.respuesta)) {
                return respuestaDependencia.respuesta.some((r) =>
                    valorEsperado.includes(r.toString())
                );
            }
            return valorEsperado.includes(respuestaDependencia.respuesta.toString());
        } else {
            // Si esperamos un único valor
            if (Array.isArray(respuestaDependencia.respuesta)) {
                return respuestaDependencia.respuesta.includes(valorEsperado);
            }
            return respuestaDependencia.respuesta.toString() === valorEsperado;
        }
    });

    // Manejar respuesta del usuario
    const manejarRespuesta = (preguntaId: string, respuesta: string | string[] | number) => {
        // Guardar respuesta en el estado global
        dispatch({
            type: 'AGREGAR_RESPUESTA',
            payload: {
                preguntaId,
                respuesta,
            },
        });

        // Avanzar a la siguiente pregunta si hay más
        if (preguntaActual < preguntasMostradas.length - 1) {
            setPreguntaActual(preguntaActual + 1);
        } else {
            // Si es la última pregunta, procesar resultados
            procesarRespuestas();
        }
    };

    // Navegar a la pregunta anterior
    const irPreguntaAnterior = () => {
        if (preguntaActual > 0) {
            setPreguntaActual(preguntaActual - 1);
        }
    };

    // Reiniciar el cuestionario
    const reiniciarCuestionario = () => {
        dispatch({ type: 'ACTUALIZAR_RESPUESTAS', payload: [] });
        setPreguntaActual(0);
    };

    // Procesar respuestas para generar filtros y recomendaciones
    const procesarRespuestas = () => {
        // Aquí procesaríamos las respuestas para generar filtros
        // Este es un ejemplo simplificado
        const filtros: FiltrosRecomendacion = {
            presupuestoMax: obtenerPresupuestoMax(),
            categorias: obtenerCategorias(),
            usos: obtenerUsos(),
        };

        // Guardar filtros en el contexto global
        dispatch({ type: 'ESTABLECER_FILTROS', payload: filtros });

        // Aplicar filtros para generar recomendaciones
        filtrarProductos(filtros);

        // Cambiar al paso de resultados
        dispatch({ type: 'AVANZAR_PASO', payload: PasoApp.RESULTADOS });

        // Navegar a la página de resultados
        navigate('/resultados');
    };

    // Obtener presupuesto máximo de las respuestas
    const obtenerPresupuestoMax = (): number => {
        const respuestaPresupuesto = state.respuestas.find(
            (r) => r.preguntaId === 'presupuesto'
        );

        if (respuestaPresupuesto) {
            return Number(respuestaPresupuesto.respuesta);
        }

        return 1000000; // Valor por defecto
    };

    // Obtener categorías de producto de las respuestas
    const obtenerCategorias = (): CategoriaProducto[] => {
        const respuestaCategoria = state.respuestas.find(
            (r) => r.preguntaId === 'categoria'
        );

        if (respuestaCategoria) {
            if (Array.isArray(respuestaCategoria.respuesta)) {
                return respuestaCategoria.respuesta as CategoriaProducto[];
            } else {
                return [respuestaCategoria.respuesta as CategoriaProducto];
            }
        }

        return [CategoriaProducto.NOTEBOOK]; // Valor por defecto
    };

    // Obtener usos de las respuestas
    const obtenerUsos = (): string[] => {
        const respuestaUso = state.respuestas.find(
            (r) => r.preguntaId === 'uso'
        );

        if (respuestaUso) {
            if (Array.isArray(respuestaUso.respuesta)) {
                return respuestaUso.respuesta as string[];
            } else {
                return [respuestaUso.respuesta as string];
            }
        }

        return []; // Valor por defecto
    };

    // Simulación de preguntas para el ejemplo
    const obtenerPreguntasSimuladas = async (): Promise<Pregunta[]> => {
        // Simular retraso de carga
        await new Promise((resolve) => setTimeout(resolve, 1000));

        return [
            {
                id: 'categoria',
                texto: '¿Qué tipo de equipo estás buscando?',
                tipo: TipoPregunta.OPCION_UNICA,
                opciones: [
                    {
                        id: 'notebook',
                        texto: 'Notebook',
                        valor: CategoriaProducto.NOTEBOOK,
                        imagen: '/assets/icons/notebook.svg',
                    },
                    {
                        id: 'desktop',
                        texto: 'Computador de escritorio',
                        valor: CategoriaProducto.DESKTOP,
                        imagen: '/assets/icons/desktop.svg',
                    },
                    {
                        id: 'gamer',
                        texto: 'Equipo Gamer',
                        valor: CategoriaProducto.GAMER,
                        imagen: '/assets/icons/gamer.svg',
                    },
                ],
                ordenPresentacion: 1,
            },
            {
                id: 'uso',
                texto: '¿Para qué usarás principalmente tu equipo?',
                tipo: TipoPregunta.OPCION_MULTIPLE,
                opciones: [
                    {
                        id: 'ofimatica',
                        texto: 'Ofimática (Office, navegación web, correo)',
                        valor: 'ofimatica',
                    },
                    {
                        id: 'estudio',
                        texto: 'Estudio y tareas escolares',
                        valor: 'estudio',
                    },
                    {
                        id: 'profesional',
                        texto: 'Trabajo profesional',
                        valor: 'profesional',
                    },
                    {
                        id: 'diseno',
                        texto: 'Diseño gráfico y edición de fotos',
                        valor: 'diseno',
                    },
                    {
                        id: 'video',
                        texto: 'Edición de video',
                        valor: 'video',
                    },
                    {
                        id: 'gaming',
                        texto: 'Juegos',
                        valor: 'gaming',
                    },
                    {
                        id: 'programacion',
                        texto: 'Programación y desarrollo',
                        valor: 'programacion',
                    },
                ],
                ordenPresentacion: 2,
            },
            {
                id: 'presupuesto',
                texto: '¿Cuál es tu presupuesto máximo?',
                tipo: TipoPregunta.RANGO,
                opciones: [
                    {
                        id: 'presupuesto',
                        texto: 'Presupuesto en pesos chilenos',
                        valor: '300000',
                    },
                ],
                ordenPresentacion: 3,
            },
            {
                id: 'portabilidad',
                texto: '¿Qué tan importante es la portabilidad para ti?',
                tipo: TipoPregunta.OPCION_UNICA,
                dependeDe: {
                    preguntaId: 'categoria',
                    valorEsperado: CategoriaProducto.NOTEBOOK,
                },
                opciones: [
                    {
                        id: 'muy-importante',
                        texto: 'Muy importante, lo llevaré conmigo a diario',
                        valor: 'alta',
                    },
                    {
                        id: 'importante',
                        texto: 'Importante, lo moveré ocasionalmente',
                        valor: 'media',
                    },
                    {
                        id: 'poco-importante',
                        texto: 'Poco importante, lo usaré mayormente en un solo lugar',
                        valor: 'baja',
                    },
                ],
                ordenPresentacion: 4,
            },
            {
                id: 'rendimiento-gaming',
                texto: '¿Qué tipo de juegos quieres jugar?',
                tipo: TipoPregunta.OPCION_UNICA,
                dependeDe: {
                    preguntaId: 'uso',
                    valorEsperado: 'gaming',
                },
                opciones: [
                    {
                        id: 'casual',
                        texto: 'Juegos casuales y poco exigentes',
                        valor: 'bajo',
                    },
                    {
                        id: 'medio',
                        texto: 'Juegos populares a calidad media',
                        valor: 'medio',
                    },
                    {
                        id: 'alto',
                        texto: 'Juegos exigentes a alta calidad',
                        valor: 'alto',
                    },
                ],
                ordenPresentacion: 5,
            },
        ];
    };

    // Si está cargando, mostrar indicador
    if (cargando) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 border-4 border-secondary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-300">Cargando cuestionario...</p>
            </div>
        );
    }

    // Si hay error, mostrar mensaje
    if (error) {
        return (
            <div className="bg-dark-900 rounded-lg p-8 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                    Intentar nuevamente
                </Button>
            </div>
        );
    }

    // Si no hay preguntas, mostrar mensaje
    if (preguntasMostradas.length === 0) {
        return (
            <div className="bg-dark-900 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No hay preguntas disponibles en este momento.</p>
                <Button variant="primary" onClick={() => navigate('/')}>
                    Volver al inicio
                </Button>
            </div>
        );
    }

    // Obtener la pregunta actual a mostrar
    const pregunta = preguntasMostradas[preguntaActual];
    const progreso = ((preguntaActual + 1) / preguntasMostradas.length) * 100;

    return (
        <div className="max-w-3xl mx-auto">
            {/* Indicador de progreso */}
            <IndicadorProgreso
                progreso={progreso}
                pasoActual={preguntaActual + 1}
                totalPasos={preguntasMostradas.length}
            />

            {/* Contenedor del cuestionario */}
            <div className="bg-dark-800 rounded-lg p-6 md:p-8 shadow-lg mt-6 border border-gray-700">
                {/* Pregunta actual */}
                <PreguntaItem
                    pregunta={pregunta}
                    respuestaActual={state.respuestas.find((r) => r.preguntaId === pregunta.id)?.respuesta}
                    onRespuesta={manejarRespuesta}
                />

                {/* Botones de navegación */}
                <div className="flex justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={irPreguntaAnterior}
                        disabled={preguntaActual === 0}
                    >
                        Anterior
                    </Button>

                    {/* Si es la última pregunta, mostrar botón para ver resultados */}
                    {preguntaActual === preguntasMostradas.length - 1 ? (
                        <Button
                            variant="primary"
                            onClick={procesarRespuestas}
                            disabled={!state.respuestas.some((r) => r.preguntaId === pregunta.id)}
                        >
                            Ver resultados
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => {
                                // Verificar si ya se respondió la pregunta actual
                                const tieneRespuesta = state.respuestas.some(
                                    (r) => r.preguntaId === pregunta.id
                                );

                                if (tieneRespuesta) {
                                    // Avanzar a la siguiente pregunta
                                    setPreguntaActual(preguntaActual + 1);
                                }
                            }}
                            disabled={!state.respuestas.some((r) => r.preguntaId === pregunta.id)}
                        >
                            Siguiente
                        </Button>
                    )}
                </div>
            </div>

            {/* Botón para reiniciar cuestionario */}
            <div className="text-center mt-6">
                <Button variant="ghost" size="sm" onClick={reiniciarCuestionario}>
                    Reiniciar cuestionario
                </Button>
            </div>
        </div>
    );
};

export default Cuestionario;