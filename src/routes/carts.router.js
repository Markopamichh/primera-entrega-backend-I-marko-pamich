import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const updatedCart = await cartManager.updateCart(req.params.cid, req.body);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const clearedCart = await cartManager.clearCart(req.params.cid);
    if (!clearedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(clearedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
