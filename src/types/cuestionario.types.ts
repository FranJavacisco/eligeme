export interface Pregunta {
    id: string;
    texto: string;
    tipo: TipoPregunta;
    opciones?: Opcion[];
    dependeDe?: {
        preguntaId: string;
        valorEsperado: string | string[];
    };
    ordenPresentacion: number;
}

export enum TipoPregunta {
    OPCION_UNICA = 'opcion_unica',
    OPCION_MULTIPLE = 'opcion_multiple',
    RANGO = 'rango',
    ENTRADA_TEXTO = 'entrada_texto',
}

export interface Opcion {
    id: string;
    texto: string;
    valor: string;
    imagen?: string;
}

export interface RespuestaCuestionario {
    preguntaId: string;
    respuesta: string | string[] | number;
}

export interface FiltrosRecomendacion {
    presupuestoMin?: number;
    presupuestoMax: number;
    categorias: CategoriaProducto[];
    usos: string[];
    especificacionesMinimas?: {
        [key: string]: any;
    };
    caracteristicasRequeridas?: string[];
    ordenarPor?: 'precio' | 'popularidad' | 'calificacion';
    orden?: 'asc' | 'desc';
}
