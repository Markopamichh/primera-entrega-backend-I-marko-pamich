import Cart from '../models/Cart.js';

class CartManager {
  async createCart() {
    return Cart.create({ products: [] });
  }

  async getCartById(id) {
    return Cart.findById(id).populate('products.product').lean();
  }

  async addProductToCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    if (!cart) return null;

    const item = cart.products.find(p => p.product.toString() === productId);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    return cart.save();
  }

  async removeProductFromCart(cartId, productId) {
    return Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).lean();
  }

  async updateCart(cartId, products) {
    return Cart.findByIdAndUpdate(cartId, { products }, { new: true }).lean();
  }

  async updateProductQuantity(cartId, productId, qty) {
    return Cart.findOneAndUpdate(
      { _id: cartId, 'products.product': productId },
      { $set: { 'products.$.quantity': qty } },
      { new: true }
    ).lean();
  }

  async clearCart(cartId) {
    return Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).lean();
  }
}

export default CartManager;
