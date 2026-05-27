import { useState } from 'react';
import Productos from './componentes/Productos'
import Footer from './componentes/Footer';
 // 1. Importamos tu componente

function App() {
  // 2. Eliminamos la línea del 'count' para quitar la alerta de VSC

  return (
    <div className="App">
      
      <h1>Mi Tienda en Línea</h1>
      
      {/* 3. Agregamos tu componente aquí */}
      <Productos /> 
      <Footer /> 
    </div>
  )
}

export default App