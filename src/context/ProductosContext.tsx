import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';
import { Producto, CategoriaProducto, FiltrosRecomendacion } from '../types/producto.types';
import { buscarProductos } from '../services/api';

// Estado inicial para productos
interface EstadoProductos {
    productos: Producto[];
    productosFiltrados: Producto[];
    productosComparacion: Producto[];
    productoDestacado: Producto | null;
    cargando: boolean;
    error: string | null;
}

const initialState: EstadoProductos = {
    productos: [],
    productosFiltrados: [],
    productosComparacion: [],
    productoDestacado: null,
    cargando: false,
    error: null,
};

// Tipos de acciones
type ProductosAction =
    | { type: 'ESTABLECER_PRODUCTOS'; payload: Producto[] }
    | { type: 'FILTRAR_PRODUCTOS'; payload: FiltrosRecomendacion }
    | { type: 'AGREGAR_PRODUCTO_COMPARACION'; payload: Producto }
    | { type: 'ELIMINAR_PRODUCTO_COMPARACION'; payload: string }
    | { type: 'ESTABLECER_PRODUCTO_DESTACADO'; payload: Producto | null }
    | { type: 'ESTABLECER_CARGANDO'; payload: boolean }
    | { type: 'ESTABLECER_ERROR'; payload: string | null }
    | { type: 'LIMPIAR_COMPARACION' };

// Creación del contexto
interface ProductosContextType {
    state: EstadoProductos;
    dispatch: React.Dispatch<ProductosAction>;
    cargarProductos: (categoria?: CategoriaProducto) => Promise<void>;
    filtrarProductos: (filtros: FiltrosRecomendacion) => void;
    agregarAComparacion: (producto: Producto) => void;
    quitarDeComparacion: (productoId: string) => void;
    establecerDestacado: (producto: Producto | null) => void;
}

const ProductosContext = createContext<ProductosContextType | undefined>(undefined);

// Reducer para el estado de productos
const productosReducer = (state: EstadoProductos, action: ProductosAction): EstadoProductos => {
    switch (action.type) {
        case 'ESTABLECER_PRODUCTOS':
            return {
                ...state,
                productos: action.payload,
                productosFiltrados: action.payload,
            };
        case 'FILTRAR_PRODUCTOS':
            const filtros = action.payload;
            let productosFiltrados = [...state.productos];

            // Filtrar por categoría
            if (filtros.categorias && filtros.categorias.length > 0) {
                productosFiltrados = productosFiltrados.filter((producto) =>
                    filtros.categorias.includes(producto.categoria)
                );
            }

            // Filtrar por presupuesto
            if (filtros.presupuestoMax) {
                productosFiltrados = productosFiltrados.filter(
                    (producto) => producto.precio <= filtros.presupuestoMax
                );
            }

            if (filtros.presupuestoMin) {
                productosFiltrados = productosFiltrados.filter(
                    (producto) => producto.precio >= filtros.presupuestoMin
                );
            }

            // Ordenar resultados
            if (filtros.ordenarPor) {
                productosFiltrados.sort((a, b) => {
                    if (filtros.ordenarPor === 'precio') {
                        return filtros.orden === 'asc' ? a.precio - b.precio : b.precio - a.precio;
                    } else if (filtros.ordenarPor === 'calificacion' && a.puntuacion && b.puntuacion) {
                        return filtros.orden === 'asc' ? a.puntuacion - b.puntuacion : b.puntuacion - a.puntuacion;
                    }
                    return 0;
                });
            }

            return {
                ...state,
                productosFiltrados,
            };
        case 'AGREGAR_PRODUCTO_COMPARACION':
            // Verificar si ya existe o si ya tenemos 3 productos
            if (state.productosComparacion.length >= 3 ||
                state.productosComparacion.some(p => p.id === action.payload.id)) {
                return state;
            }

            return {
                ...state,
                productosComparacion: [...state.productosComparacion, action.payload],
            };
        case 'ELIMINAR_PRODUCTO_COMPARACION':
            return {
                ...state,
                productosComparacion: state.productosComparacion.filter(
                    (producto) => producto.id !== action.payload
                ),
            };
        case 'ESTABLECER_PRODUCTO_DESTACADO':
            return {
                ...state,
                productoDestacado: action.payload,
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
        case 'LIMPIAR_COMPARACION':
            return {
                ...state,
                productosComparacion: [],
            };
        default:
            return state;
    }
};

// Proveedor del contexto
export const ProductosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(productosReducer, initialState);

    // Cargar productos desde la API
    const cargarProductos = async (categoria?: CategoriaProducto) => {
        try {
            dispatch({ type: 'ESTABLECER_CARGANDO', payload: true });
            const productos = await buscarProductos(categoria);
            dispatch({ type: 'ESTABLECER_PRODUCTOS', payload: productos });
            dispatch({ type: 'ESTABLECER_ERROR', payload: null });
        } catch (error) {
            dispatch({
                type: 'ESTABLECER_ERROR',
                payload: 'Error al cargar productos. Por favor, intenta nuevamente.'
            });
        } finally {
            dispatch({ type: 'ESTABLECER_CARGANDO', payload: false });
        }
    };

    // Filtrar productos según criterios
    const filtrarProductos = (filtros: FiltrosRecomendacion) => {
        dispatch({ type: 'FILTRAR_PRODUCTOS', payload: filtros });
    };

    // Agregar producto a comparación
    const agregarAComparacion = (producto: Producto) => {
        dispatch({ type: 'AGREGAR_PRODUCTO_COMPARACION', payload: producto });
    };

    // Quitar producto de comparación
    const quitarDeComparacion = (productoId: string) => {
        dispatch({ type: 'ELIMINAR_PRODUCTO_COMPARACION', payload: productoId });
    };

    // Establecer producto destacado
    const establecerDestacado = (producto: Producto | null) => {
        dispatch({ type: 'ESTABLECER_PRODUCTO_DESTACADO', payload: producto });
    };

    // Cargar productos al iniciar
    useEffect(() => {
        cargarProductos();
    }, []);

    return (
        <ProductosContext.Provider
            value={{
                state,
                dispatch,
                cargarProductos,
                filtrarProductos,
                agregarAComparacion,
                quitarDeComparacion,
                establecerDestacado,
            }}
        >
            {children}
        </ProductosContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useProductosContext = () => {
    const context = useContext(ProductosContext);

    if (context === undefined) {
        throw new Error('useProductosContext debe ser usado dentro de un ProductosProvider');
    }

    return context;
};