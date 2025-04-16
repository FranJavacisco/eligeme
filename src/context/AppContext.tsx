import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import {
    EstadoApp,
    PasoApp,
    RespuestaCuestionario,
    FiltrosRecomendacion
} from '../types/app.types';

// Definición del estado inicial
const initialState: EstadoApp = {
    pasoActual: PasoApp.INICIO,
    respuestas: [],
    filtrosAplicados: null,
    productosSeleccionados: [],
    cargando: false,
    error: null,
};

// Tipos de acciones
type AppAction =
    | { type: 'AVANZAR_PASO'; payload: PasoApp }
    | { type: 'RETROCEDER_PASO' }
    | { type: 'AGREGAR_RESPUESTA'; payload: RespuestaCuestionario }
    | { type: 'ACTUALIZAR_RESPUESTAS'; payload: RespuestaCuestionario[] }
    | { type: 'ESTABLECER_FILTROS'; payload: FiltrosRecomendacion }
    | { type: 'AGREGAR_PRODUCTO_SELECCIONADO'; payload: string }
    | { type: 'ELIMINAR_PRODUCTO_SELECCIONADO'; payload: string }
    | { type: 'LIMPIAR_PRODUCTOS_SELECCIONADOS' }
    | { type: 'ESTABLECER_CARGANDO'; payload: boolean }
    | { type: 'ESTABLECER_ERROR'; payload: string | null }
    | { type: 'REINICIAR_APP' };

// Definición del contexto
interface AppContextType {
    state: EstadoApp;
    dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Función reductora para gestionar el estado
const appReducer = (state: EstadoApp, action: AppAction): EstadoApp => {
    switch (action.type) {
        case 'AVANZAR_PASO':
            return {
                ...state,
                pasoActual: action.payload,
            };
        case 'RETROCEDER_PASO':
            // Lógica para retroceder al paso anterior
            const pasoActual = state.pasoActual;
            let nuevoPaso: PasoApp;

            switch (pasoActual) {
                case PasoApp.CUESTIONARIO:
                    nuevoPaso = PasoApp.INICIO;
                    break;
                case PasoApp.RESULTADOS:
                    nuevoPaso = PasoApp.CUESTIONARIO;
                    break;
                case PasoApp.COMPARACION:
                    nuevoPaso = PasoApp.RESULTADOS;
                    break;
                case PasoApp.DETALLE:
                    nuevoPaso = PasoApp.RESULTADOS;
                    break;
                default:
                    nuevoPaso = PasoApp.INICIO;
            }

            return {
                ...state,
                pasoActual: nuevoPaso,
            };
        case 'AGREGAR_RESPUESTA':
            // Agregar o actualizar una respuesta en el array
            const respuestaIndex = state.respuestas.findIndex(
                (r) => r.preguntaId === action.payload.preguntaId
            );

            if (respuestaIndex >= 0) {
                // Si la respuesta ya existe, la actualizamos
                const nuevasRespuestas = [...state.respuestas];
                nuevasRespuestas[respuestaIndex] = action.payload;

                return {
                    ...state,
                    respuestas: nuevasRespuestas,
                };
            } else {
                // Si es una nueva respuesta, la agregamos
                return {
                    ...state,
                    respuestas: [...state.respuestas, action.payload],
                };
            }
        case 'ACTUALIZAR_RESPUESTAS':
            return {
                ...state,
                respuestas: action.payload,
            };
        case 'ESTABLECER_FILTROS':
            return {
                ...state,
                filtrosAplicados: action.payload,
            };
        case 'AGREGAR_PRODUCTO_SELECCIONADO':
            // Máximo 3 productos para comparar
            if (state.productosSeleccionados.length >= 3) {
                return state;
            }

            if (state.productosSeleccionados.includes(action.payload)) {
                return state;
            }

            return {
                ...state,
                productosSeleccionados: [...state.productosSeleccionados, action.payload],
            };
        case 'ELIMINAR_PRODUCTO_SELECCIONADO':
            return {
                ...state,
                productosSeleccionados: state.productosSeleccionados.filter(
                    (id) => id !== action.payload
                ),
            };
        case 'LIMPIAR_PRODUCTOS_SELECCIONADOS':
            return {
                ...state,
                productosSeleccionados: [],
            };
        case 'ESTABLECER_CARGANDO':
            return {
                ...state,
                cargando: action.payload,
            };
        case 'ESTABLECER_ERROR':
            return {
                ...state,
                error: action.payload,
            };
        case 'REINICIAR_APP':
            return {
                ...initialState,
            };
        default:
            return state;
    }
};

// Proveedor del contexto
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAppContext = () => {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error('useAppContext debe ser usado dentro de un AppProvider');
    }

    return context;
};