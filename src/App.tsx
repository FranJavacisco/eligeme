import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ProductosProvider } from './context/ProductosContext';
import Home from './pages/Home';
import Cuestionario from './pages/Cuestionario';
import Resultados from './pages/Resultados';
import Comparar from './pages/Comparar';
import DetalleProducto from './pages/DetalleProducto';
import ComoFunciona from './pages/ComoFunciona';

function App() {
  return (
    <AppProvider>
      <ProductosProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cuestionario" element={<Cuestionario />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/comparar" element={<Comparar />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProductosProvider>
    </AppProvider>
  );
}

export default App;