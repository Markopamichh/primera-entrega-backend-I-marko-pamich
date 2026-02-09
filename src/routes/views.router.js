import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// Home view - static product list
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', {
      title: 'Inicio - Lista de Productos',
      products
    });
  } catch (error) {
    res.status(500).render('home', {
      title: 'Error',
      error: 'Error al cargar productos',
      products: []
    });
  }
});

// Real-time products view
router.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products
    });
  } catch (error) {
    res.status(500).render('realTimeProducts', {
      title: 'Error',
      error: 'Error al cargar productos',
      products: []
    });
  }
});

export default router;
