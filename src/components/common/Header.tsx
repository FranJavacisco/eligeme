import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { PasoApp } from '../../types/app.types';

const Header: React.FC = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const { state, dispatch } = useAppContext();
    const { pasoActual } = state;
    const location = useLocation();

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const reiniciarApp = () => {
        dispatch({ type: 'REINICIAR_APP' });
        setMenuAbierto(false);
    };

    // Obtener el título según la ruta o paso actual
    const obtenerTitulo = () => {
        switch (pasoActual) {
            case PasoApp.INICIO:
                return 'Eligeme';
            case PasoApp.CUESTIONARIO:
                return '¿Qué estás buscando?';
            case PasoApp.RESULTADOS:
                return 'Recomendaciones para ti';
            case PasoApp.COMPARACION:
                return 'Comparación de productos';
            case PasoApp.DETALLE:
                return 'Detalle del producto';
            default:
                return 'Eligeme';
        }
    };

    return (
        <header className="bg-dark-900 border-b border-gray-800 px-4 md:px-8 py-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo y título */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center" onClick={reiniciarApp}>
                        <div className="h-10 w-10 mr-3 bg-gradient-to-br from-secondary-500 to-accent-400 rounded-lg flex items-center justify-center shadow-neon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-secondary-300 to-accent-300 bg-clip-text text-transparent">
                            {obtenerTitulo()}
                        </h1>
                    </Link>
                </div>

                {/* Botón de menú móvil */}
                <div className="md:hidden">
                    <button
                        className="text-white hover:text-accent-300 focus:outline-none"
                        onClick={toggleMenu}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {menuAbierto ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Menú de navegación escritorio */}
                <nav className="hidden md:flex space-x-6">
                    <Link
                        to="/"
                        className={`text-sm font-medium ${location.pathname === '/' ? 'text-accent-400' : 'text-gray-300 hover:text-white'
                            }`}
                        onClick={reiniciarApp}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/como-funciona"
                        className={`text-sm font-medium ${location.pathname === '/como-funciona' ? 'text-accent-400' : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Cómo funciona
                    </Link>
                    <Link
                        to="/comparar"
                        className={`text-sm font-medium ${location.pathname === '/comparar' ? 'text-accent-400' : 'text-gray-300 hover:text-white'
                            }`}
                    >
                        Comparador
                    </Link>
                </nav>
            </div>

            {/* Menú móvil */}
            {menuAbierto && (
                <div className="md:hidden mt-4 py-3 border-t border-gray-800">
                    <div className="container mx-auto flex flex-col space-y-3">
                        <Link
                            to="/"
                            className={`text-sm font-medium ${location.pathname === '/' ? 'text-accent-400' : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => {
                                reiniciarApp();
                                setMenuAbierto(false);
                            }}
                        >
                            Inicio
                        </Link>
                        <Link
                            to="/como-funciona"
                            className={`text-sm font-medium ${location.pathname === '/como-funciona' ? 'text-accent-400' : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => setMenuAbierto(false)}
                        >
                            Cómo funciona
                        </Link>
                        <Link
                            to="/comparar"
                            className={`text-sm font-medium ${location.pathname === '/comparar' ? 'text-accent-400' : 'text-gray-300 hover:text-white'
                                }`}
                            onClick={() => setMenuAbierto(false)}
                        >
                            Comparador
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;