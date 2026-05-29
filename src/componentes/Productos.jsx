import { useState, useEffect } from 'react';

// 1. Recibimos la prop 'alHacerClickContacto' en los parámetros del componente
const Productos = ({ alHacerClickContacto }) => { 
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch('/productos.json'); 
        if (!respuesta.ok) {
          throw new Error('No se pudo cargar el archivo de productos');
        }
        const datos = await respuesta.json();
        setListaProductos(datos); 
      } catch (err) {
        console.error("Error al obtener los productos:", err);
        setError(err.message);
      } finally {
        setCargando(false); 
      }
    };

    obtenerProductos();
  }, []); 

  if (cargando) return <div className="text-center my-5"><p>Cargando productos...</p></div>;
  if (error) return <div className="text-center text-danger my-5"><p>Hubo un problema: {error}</p></div>;

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 className="m-0">Nuestros Productos ({listaProductos.length})</h2>
        
        {/* 2. Vinculamos la prop al evento onClick del botón */}
        <button 
          className="btn btn-primary px-4 fw-bold shadow-sm"
          onClick={alHacerClickContacto} 
        >
          Información de Contacto 
        </button>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {listaProductos.map((producto) => (
          <div key={producto.id} className="col">
            <div className="card h-100 shadow-sm">
              
              {producto.imagenes && producto.imagenes.length > 0 && (
                <div style={{ height: '240px', background: '#f8f9fa', display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={`/${producto.imagenes[0]}`} 
                    className="card-img-top p-3"
                    alt={producto.nombre} 
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain', 
                      margin: '0 auto' 
                    }}
                  />
                </div>
              )}
              
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark fw-bold mb-2">{producto.nombre}</h5>
                
                <div className="mb-3 flex-grow-1">
                  <span className="badge bg-secondary text-capitalize px-2 py-1.5" style={{ fontSize: '0.8rem' }}>
                    {producto.categoria}
                  </span>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-success">${producto.precio.toFixed(2)}</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Productos;