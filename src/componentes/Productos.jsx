import { useState, useEffect } from 'react';

// --- COMPONENTE DEL FORMULARIO ADAPTADO ---
const FormularioAgregar = ({ alGuardar, alCancelar }) => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenArchivo, setImagenArchivo] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    // Creamos el objeto siguiendo exactamente tu orden y claves:
    // id, nombre, precio, categoria, imagenes
    const nuevoProducto = {
      id: Date.now(), // ID numérico temporal
      nombre: nombre,
      precio: parseFloat(precio) || 0.00,
      categoria: categoria,
      imagenes: [imagenArchivo ? `img/${imagenArchivo}` : 'img/placeholder.jpg']
    };

    alGuardar(nuevoProducto);
  };

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card shadow p-4">
        <h3 className="text-center mb-4 text-primary">Agregar Nuevo Artículo</h3>
        <form onSubmit={manejarEnvio}>
          
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre del Producto</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              placeholder="Ej: Juego de Bandejas de Cerámica"
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Precio ($)</label>
            <input 
              type="number" 
              className="form-control" 
              required 
              step="0.01" 
              placeholder="0.00"
              value={precio} 
              onChange={(e) => setPrecio(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Categoría</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              placeholder="Ej: cocina"
              value={categoria} 
              onChange={(e) => setCategoria(e.target.value)} 
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Nombre del archivo de imagen</label>
            <div className="input-group">
              <span className="input-group-text">img/</span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="bandejadeceramica.jpg"
                required
                value={imagenArchivo} 
                onChange={(e) => setImagenArchivo(e.target.value)} 
              />
            </div>
            <small className="text-muted">La aplicación le añadirá el "img/" automáticamente al inicio.</small>
          </div>

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-success flex-grow-1">Guardar Producto</button>
            <button type="button" className="btn btn-outline-secondary" onClick={alCancelar}>Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL ---
const Productos = () => {
  const [listaProductos, setListaProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [vistaActual, setVistaActual] = useState('lista');

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

  const agregarNuevoProducto = (nuevo) => {
    // Agrega el nuevo producto al inicio de la lista en pantalla
    setListaProductos([nuevo, ...listaProductos]); 
    
    // OPCIONAL: Muestra en la consola el objeto exacto listo para copiar si lo necesitas
    console.log("Objeto generado listo para tu JSON:", JSON.stringify(nuevo, null, 2));
    
    setVistaActual('lista'); 
  };

  if (cargando) return <div className="text-center my-5"><p>Cargando productos...</p></div>;
  if (error) return <div className="text-center text-danger my-5"><p>Hubo un problema: {error}</p></div>;

  if (vistaActual === 'formulario') {
    return (
      <FormularioAgregar 
        alGuardar={agregarNuevoProducto} 
        alCancelar={() => setVistaActual('lista')} 
      />
    );
  }

  return (
    <div className="container my-5">
      
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
        <h2 className="m-0">Nuestros Productos ({listaProductos.length})</h2>
        <button 
          className="btn btn-primary px-4 fw-bold shadow-sm"
          onClick={() => setVistaActual('formulario')}
        >
          ➕ Agregar Artículo
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
                
                {/* Muestra la categoría como una etiqueta de Bootstrap */}
                <div className="mb-3 flex-grow-1">
                  <span className="badge bg-secondary text-capitalize px-2 py-1.5" style={{ fontSize: '0.8rem' }}>
                    {producto.categoria}
                  </span>
                </div>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-success">${producto.precio.toFixed(2)}</span>
                  {/* <button className="btn btn-sm btn-outline-primary">Ver detalle</button> */}
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