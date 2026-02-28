import ProductManager from '../managers/ProductManager.js';

const productManager = new ProductManager();

export function initProductSocket(io) {
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    productManager.getProducts({ limit: 100, page: 1 })
      .then(result => {
        socket.emit('products', result.docs);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
      });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
}
