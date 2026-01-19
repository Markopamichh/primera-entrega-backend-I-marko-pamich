import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class CartManager {
  constructor(path) {
    this.path = path;
    this.init();
  }

  async init() {
    try {
      await fs.access(this.path);
    } catch (error) {
      await fs.writeFile(this.path, JSON.stringify([], null, 2));
    }
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error al leer el archivo de carritos');
    }
  }

  async #writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error('Error al escribir en el archivo de carritos');
    }
  }

  async getCarts() {
    return await this.#readFile();
  }

  async createCart() {
    const carts = await this.#readFile();

    const newCart = {
      id: uuidv4(),
      products: []
    };

    carts.push(newCart);
    await this.#writeFile(carts);

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.#readFile();
    return carts.find(cart => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.#readFile();
    const cartIndex = carts.findIndex(cart => cart.id === cartId);

    if (cartIndex === -1) {
      return null;
    }

    const cart = carts[cartIndex];
    const productIndex = cart.products.findIndex(p => p.product === productId);

    if (productIndex !== -1) {
      // Producto ya existe en el carrito, incrementar quantity
      cart.products[productIndex].quantity += 1;
    } else {
      // Producto no existe, agregarlo con quantity 1
      cart.products.push({
        product: productId,
        quantity: 1
      });
    }

    await this.#writeFile(carts);
    return cart;
  }
}

export default CartManager;
