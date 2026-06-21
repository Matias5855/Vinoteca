import { useState, useMemo } from 'react';
import { productos, categorias } from './data/memoryDB';
import './index.css';

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [vista, setVista] = useState('catalogo');

  const productosMostrados = useMemo(() => {
    return productos.filter(prod => {
      const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = filtroCategoria ? prod.idCategoria === filtroCategoria : true;
      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, filtroCategoria]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const index = prev.findIndex(item => item.idProducto === producto.idProducto);
      if (index >= 0) {
        const nuevoCarrito = [...prev];
        if (nuevoCarrito[index].cantidad < producto.stock) {
          nuevoCarrito[index].cantidad += 1;
        } else {
          alert("Stock máximo alcanzado para esta partida.");
        }
        return nuevoCarrito;
      }
      return [...prev, {
        idProducto: producto.idProducto,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        cantidad: 1
      }];
    });
  };

  const simularCompra = () => {
    if (carrito.length === 0) return alert("El carrito está vacío");
    alert(`¡Adquisición confirmada! Total de la inversión: $${carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0)}`);
    setCarrito([]);
    setVista('catalogo');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h1 className="logo">Cava <span>Privada</span></h1>
        <div className="nav-controls">
          <button className="btn-cart" onClick={() => setVista(vista === 'catalogo' ? 'carrito' : 'catalogo')}>
            {vista === 'catalogo' ? 'Mi Selección' : 'Volver al Catálogo'} ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})
          </button>
        </div>
      </nav>

      <main>
        {vista === 'catalogo' ? (
          <>
            {/* Nueva sección Hero para dar elegancia al comienzo */}
            <header className="hero-section">
              <div className="hero-overlay"></div>
              <div className="hero-content">
                <h2>El Arte del Vino en su Máxima Expresión</h2>
                <p>Descubra nuestra colección curada de ediciones limitadas y añadas históricas.</p>
              </div>
            </header>

            <div className="filtros-container">
              <input 
                type="text" 
                className="input-elegante"
                placeholder="Buscar etiqueta o bodega..." 
                value={busqueda} 
                onChange={(e) => setBusqueda(e.target.value)} 
              />
              <select className="select-elegante" value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
                <option value="">Colección Completa</option>
                {categorias.map(c => (
                  <option key={c.idCategoria} value={c.idCategoria}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="catalogo">
              {productosMostrados.length === 0 ? <p className="mensaje-vacio">No hay etiquetas que coincidan con su búsqueda.</p> : null}
              {productosMostrados.map(prod => (
                <div key={prod.idProducto} className="producto-card">
                  <div className="imagen-container">
                    <img src={prod.imagenUrl} alt={prod.nombre} />
                  </div>
                  <div className="producto-info">
                    <span className="bodega">{prod.bodega}</span>
                    <h3>{prod.nombre}</h3>
                    <span className="cosecha">Cosecha {prod.cosecha}</span>
                    <p className="descripcion">{prod.descripcion}</p>
                    <p className="precio">${prod.precio.toLocaleString('es-AR')}</p>
                    <button className="btn-agregar" onClick={() => agregarAlCarrito(prod)}>Añadir a la Cava</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="carrito-view">
            <h2>Su Selección de Vinos</h2>
            {carrito.length === 0 ? <p className="mensaje-vacio">Su selección está vacía.</p> : (
              <div className="carrito-lista">
                {carrito.map(item => (
                  <div key={item.idProducto} className="carrito-item">
                    <div className="item-detalle">
                      <span className="item-nombre">{item.nombre}</span>
                      <span className="item-cantidad">Cantidad: {item.cantidad}</span>
                    </div>
                    <span className="item-precio">${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}</span>
                  </div>
                ))}
                <div className="carrito-total">
                  <h3>Inversión Total</h3>
                  <h3>${carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0).toLocaleString('es-AR')}</h3>
                </div>
                <button className="btn-comprar" onClick={simularCompra}>Confirmar Adquisición</button>
              </div>
            )}
          </div>
        )}
      </main>
      
      <footer className="footer-elegante">
        <p>© 2026 Cava Privada. Exclusividad para coleccionistas.</p>
      </footer>
    </div>
  );
}