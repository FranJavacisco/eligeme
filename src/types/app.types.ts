export enum PasoApp {
    INICIO = 'inicio',
    CUESTIONARIO = 'cuestionario',
    RESULTADOS = 'resultados',
    COMPARACION = 'comparacion',
    DETALLE = 'detalle',
}

export interface EstadoApp {
    pasoActual: PasoApp;
    respuestas: RespuestaCuestionario[];
    filtrosAplicados: FiltrosRecomendacion | null;
    productosSeleccionados: string[];
    cargando: boolean;
    error: string | null;
}