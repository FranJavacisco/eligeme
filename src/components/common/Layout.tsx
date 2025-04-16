import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAppContext } from '../../context/AppContext';
import { PasoApp } from '../../types/app.types';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { state } = useAppContext();
    const { pasoActual, cargando } = state;

    // Determinar clase CSS según el paso actual para diferentes efectos visuales
    const obtenerClaseBackgroundPorPaso = () => {
        switch (pasoActual) {
            case PasoApp.INICIO:
                return 'bg-dark-gradient';
            case PasoApp.CUESTIONARIO:
                return 'bg-dark-gradient';
            case PasoApp.RESULTADOS:
                return 'bg-dark-800';
            case PasoApp.COMPARACION:
                return 'bg-dark-800';
            case PasoApp.DETALLE:
                return 'bg-dark-gradient';
            default:
                return 'bg-dark-gradient';
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${obtenerClaseBackgroundPorPaso()}`}>
            <Header />

            <main className="flex-grow px-4 md:px-8 py-6 container mx-auto relative">
                {/* Overlay de carga */}
                {cargando && (
                    <div className="absolute inset-0 bg-dark-900 bg-opacity-70 flex items-center justify-center z-50">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-400"></div>
                            <p className="mt-4 text-accent-300 font-medium">Cargando...</p>
                        </div>
                    </div>
                )}

                {/* Contenido principal */}
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;