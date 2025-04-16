export interface Producto {
    id: string;
    nombre: string;
    marca: string;
    modelo: string;
    precio: number;
    precioOriginal?: number;
    urlImagen: string;
    urlProducto: string;
    categoria: CategoriaProducto;
    especificaciones: {
        procesador?: string;
        ram?: string;
        almacenamiento?: string;
        tarjetaGrafica?: string;
        pantalla?: string;
        sistema?: string;
        conectividad?: string[];
        bateria?: string;
        peso?: string;
        [key: string]: any;
    };
    destacado?: boolean;
    stock: boolean;
    puntuacion?: number;
    fechaActualizacion: Date;
}

export enum CategoriaProducto {
    NOTEBOOK = 'notebook',
    DESKTOP = 'desktop',
    GAMER = 'gamer',
    TABLET = 'tablet',
    TELEFONO = 'telefono',
    TV = 'tv',
    AUDIO = 'audio',
    ELECTRODOMESTICO = 'electrodomestico',
}
