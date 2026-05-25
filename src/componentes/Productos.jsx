import { useState, useEffect } from 'react';

const Productos = () => {
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
      <h2 className="text-center mb-4">Nuestros Productos</h2>
      
      {/* Grid de Bootstrap: 1 columna en móvil, 2 en tablets, 3 en pantallas medianas y 4 en grandes */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {listaProductos.map((producto) => (
          <div key={producto.id} className="col">
            {/* Card de Bootstrap con altura completa del contenedor h-100 */}
            <div className="card h-100 shadow-sm">
              
              {/* Contenedor de la imagen optimizado para el espacio de 3 columnas */}
              {producto.imagenes && producto.imagenes.length > 0 && (
                <div style={{ height: '240px', background: '#f8f9fa', display: 'flex', alignItems: 'center' }}>
                  <img 
                    src={`/${producto.imagenes[0]}`} 
                    className="card-img-top p-3"
                    alt={producto.nombre} 
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain', // Mantiene la foto íntegra, sin recortes artificiales
                      margin: '0 auto' 
                    }}
                  />
                </div>
              )}
              
              {/* Cuerpo de la tarjeta */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-dark fw-bold">{producto.nombre}</h5>
                <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
                  {producto.descripcion}
                </p>
                <div className="mt-3 d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-success">${producto.precio}</span>
                  <button className="btn btn-sm btn-outline-primary">Ver detalle</button>
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