import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-dark-900 border-t border-gray-800 py-6 mt-auto">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo y descripción */}
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center justify-center md:justify-start">
                            <div className="h-8 w-8 mr-2 bg-gradient-to-br from-secondary-500 to-accent-400 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white bg-gradient-to-r from-secondary-300 to-accent-300 bg-clip-text text-transparent">
                                Eligeme
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-2 text-center md:text-left max-w-xs">
                            Tu asistente de compra para encontrar el equipo ideal en Ripley Chile.
                        </p>
                    </div>

                    {/* Enlaces de navegación */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6 md:mb-0">
                        <Link to="/" className="text-gray-300 hover:text-accent-300 text-sm">
                            Inicio
                        </Link>
                        <Link to="/como-funciona" className="text-gray-300 hover:text-accent-300 text-sm">
                            Cómo funciona
                        </Link>
                        <Link to="/comparar" className="text-gray-300 hover:text-accent-300 text-sm">
                            Comparador
                        </Link>
                        <a
                            href="https://www.ripley.cl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-accent-300 text-sm"
                        >
                            Ripley Chile
                        </a>
                    </div>

                    {/* Info legal */}
                    <div className="text-center md:text-right">
                        <p className="text-gray-500 text-xs">
                            Esta aplicación utiliza datos de Ripley Chile para proporcionar recomendaciones.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            No está afiliada oficialmente con Ripley.
                        </p>
                        <p className="text-gray-400 text-xs mt-3">
                            &copy; {new Date().getFullYear()} Eligeme App
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;