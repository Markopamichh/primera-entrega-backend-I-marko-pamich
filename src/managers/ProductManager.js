import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
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
      throw new Error('Error al leer el archivo de productos');
    }
  }

  async #writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error('Error al escribir en el archivo de productos');
    }
  }

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find(product => product.id === id);
  }

  async addProduct(productData) {
    const products = await this.#readFile();

    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
      if (!productData[field] && productData[field] !== 0) {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    const codeExists = products.some(product => product.code === productData.code);
    if (codeExists) {
      throw new Error(`El código ${productData.code} ya existe`);
    }

    if (typeof productData.price !== 'number' || productData.price <= 0) {
      throw new Error('El precio debe ser un número mayor a 0');
    }

    if (typeof productData.stock !== 'number' || productData.stock < 0) {
      throw new Error('El stock debe ser un número mayor o igual a 0');
    }

    const newProduct = {
      id: uuidv4(),
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: productData.price,
      status: productData.status !== undefined ? productData.status : true,
      stock: productData.stock,
      category: productData.category,
      thumbnails: productData.thumbnails || []
    };

    products.push(newProduct);
    await this.#writeFile(products);

    return newProduct;
  }

  async updateProduct(id, updateData) {
    const products = await this.#readFile();
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
      return null;
    }

    if (updateData.id) {
      delete updateData.id;
    }

    if (updateData.code) {
      const codeExists = products.some(
        product => product.code === updateData.code && product.id !== id
      );
      if (codeExists) {
        throw new Error(`El código ${updateData.code} ya existe`);
      }
    }

    products[index] = {
      ...products[index],
      ...updateData,
      id: products[index].id
    };

    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.#readFile();
    const index = products.findIndex(product => product.id === id);

    if (index === -1) {
      return null;
    }

    const deletedProduct = products.splice(index, 1)[0];
    await this.#writeFile(products);

    return deletedProduct;
  }
}

export default ProductManager;
