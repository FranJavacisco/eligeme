import axios from 'axios';
import { Producto, CategoriaProducto, FiltrosRecomendacion } from '../types/producto.types';

// URL base del backend (ajustar según entorno)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Cliente Axios con configuración básica
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Obtener productos de Ripley según categoría
export const buscarProductos = async (categoria?: CategoriaProducto): Promise<Producto[]> => {
    try {
        const endpoint = categoria ? `/productos?categoria=${categoria}` : '/productos';
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error al buscar productos:', error);
        throw error;
    }
};

// Obtener un producto específico por ID
export const obtenerProducto = async (id: string): Promise<Producto> => {
    try {
        const response = await apiClient.get(`/productos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener producto con ID ${id}:`, error);
        throw error;
    }
};

// Obtener recomendaciones de productos basadas en filtros
export const obtenerRecomendaciones = async (filtros: FiltrosRecomendacion): Promise<Producto[]> => {
    try {
        const response = await apiClient.post('/recomendaciones', filtros);
        return response.data;
    } catch (error) {
        console.error('Error al obtener recomendaciones:', error);
        throw error;
    }
};

// Verificar disponibilidad de un producto
export const verificarDisponibilidad = async (id: string): Promise<{ disponible: boolean, stock: number }> => {
    try {
        const response = await apiClient.get(`/productos/${id}/disponibilidad`);
        return response.data;
    } catch (error) {
        console.error(`Error al verificar disponibilidad del producto ${id}:`, error);
        throw error;
    }
};

// Obtener preguntas del cuestionario según la categoría
export const obtenerPreguntas = async (categoria?: CategoriaProducto): Promise<any[]> => {
    try {
        const endpoint = categoria ? `/cuestionario?categoria=${categoria}` : '/cuestionario';
        const response = await apiClient.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Error al obtener preguntas del cuestionario:', error);
        throw error;
    }
};