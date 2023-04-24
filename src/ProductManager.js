import mongoose from 'mongoose';
import connectToDatabase from './database.js';

const { ObjectId } = mongoose.Types;

// definición del esquema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  status: { type: Boolean, default: true },
});

// registro del modelo
const Product = mongoose.model('Product', productSchema);

class ProductManager {
  constructor() {
    this.collection = null;
    this.initialize();
  }

  async initialize() {
    await connectToDatabase();
    this.collection = Product.collection;
  }
  


  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock ||
      !product.category
    ) {
      console.log('No fueron completados todos los campos');
      return;
    }

    const productExists = await this.collection.findOne({ code: product.code });
    if (productExists) {
      console.log('Error: Ya existe un producto con el mismo codigo');
      return;
    }

    const newProduct = {
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: true,
      stock: product.stock,
      category: product.category,
      thumbnail: product.thumbnail,
    };

    const result = await this.collection.insertOne(newProduct);

    newProduct.id = result.insertedId;

    return newProduct;
  }

  async getProducts() {
    if (!this.collection) {
      console.log('Error: Colección no inicializada');
      return [];
    }
  
    const products = await this.collection.find({}).toArray();
    return products;
  }
  

  async getProductById(id) {
    const product = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!product) {
      console.log('Error: Producto no encontrado');
      return;
    }
    return product;
  }

  async updateProduct(id, updateFields) {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = { $set: updateFields };

    const result = await this.collection.updateOne(filter, updateDoc);

    if (result.matchedCount === 0) {
      console.log('Error: Producto no encontrado :(');
      return;
    }

    const updatedProduct = await this.collection.findOne(filter);

    return updatedProduct;
  }

  async deleteProduct(id) {
    const filter = { _id: new ObjectId(id) };

    const result = await this.collection.deleteOne(filter);

    if (result.deletedCount === 0) {
      console.log('Error: Producto no encontrado');
      return;
    }
  }
}

export default ProductManager;

