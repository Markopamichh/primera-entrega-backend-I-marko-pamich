import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Home view - static product list
router.get('/', async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100, page: 1 });
    res.render('home', {
      title: 'Inicio - Lista de Productos',
      products: result.docs
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
    const result = await productManager.getProducts({ limit: 100, page: 1 });
    res.render('realTimeProducts', {
      title: 'Productos en Tiempo Real',
      products: result.docs
    });
  } catch (error) {
    res.status(500).render('realTimeProducts', {
      title: 'Error',
      error: 'Error al cargar productos',
      products: []
    });
  }
});

// Paginated product catalog
router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });

    const buildLink = (p) => {
      const params = new URLSearchParams({ limit, page: p, ...(sort && { sort }), ...(query && { query }) });
      return `/products?${params.toString()}`;
    };

    res.render('products', {
      title: 'Catálogo de Productos',
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
      query: query || '',
      sort: sort || '',
      limit: Number(limit)
    });
  } catch (error) {
    res.status(500).render('products', {
      title: 'Error',
      error: 'Error al cargar productos',
      products: []
    });
  }
});

// Product detail view
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).render('productDetail', { title: 'Producto no encontrado', error: 'Producto no encontrado' });
    res.render('productDetail', {
      title: product.title,
      product
    });
  } catch (error) {
    res.status(500).render('productDetail', {
      title: 'Error',
      error: 'Error al cargar el producto'
    });
  }
});

// Cart view
router.get('/carts/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).render('cart', { title: 'Carrito no encontrado', error: 'Carrito no encontrado' });
    res.render('cart', {
      title: 'Mi Carrito',
      cart,
      products: cart.products
    });
  } catch (error) {
    res.status(500).render('cart', {
      title: 'Error',
      error: 'Error al cargar el carrito'
    });
  }
});

export default router;
