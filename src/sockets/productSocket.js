import ProductManager from '../managers/ProductManager.js';

const productManager = new ProductManager('./src/data/products.json');

export function initProductSocket(io) {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    // Send current products when client connects
    productManager.getProducts()
      .then(products => {
        socket.emit('products', products);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
}
