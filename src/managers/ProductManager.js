import Product from '../models/Product.js';

class ProductManager {
  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    const filter = {};
    if (query !== undefined && query !== '') {
      if (query === 'true') {
        filter.status = true;
      } else if (query === 'false') {
        filter.status = false;
      } else {
        filter.category = query;
      }
    }

    const sortOption =
      sort === 'asc'  ? { price: 1 } :
      sort === 'desc' ? { price: -1 } :
      undefined;

    return Product.paginate(filter, { limit: Number(limit), page: Number(page), sort: sortOption, lean: true });
  }

  async getProductById(id) {
    return Product.findById(id).lean();
  }

  async addProduct(data) {
    return new Product(data).save();
  }

  async updateProduct(id, data) {
    delete data._id;
    return Product.findByIdAndUpdate(id, data, { new: true, lean: true });
  }

  async deleteProduct(id) {
    return Product.findByIdAndDelete(id).lean();
  }
}

export default ProductManager;
