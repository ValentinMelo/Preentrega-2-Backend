import mongoose from 'mongoose';
import connectToDatabase from './database.js';

const { ObjectId } = mongoose.Types;

// definición del esquema
const cartSchema = new mongoose.Schema({
  products: [{
    productId: { type: ObjectId, required: true, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 }
  }]
});

// registro del modelo
const Cart = mongoose.model('Cart', cartSchema);

class CartManager {
  constructor() {
    this.collection = null;
    this.initialize();
  }

  async initialize() {
    await connectToDatabase();
    this.collection = Cart.collection;
  }

  async createCart() {
    const newCart = await this.collection.create({ products: [] });
    return newCart;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.collection.findOne({ _id: new ObjectId(cartId) }).populate('products.productId');
    if (!cart) {
      throw new Error('Error: carrito no encontrado');
    }

    const product = await Product.findOne({ _id: new ObjectId(productId) });
    if (!product) {
      throw new Error('Error: producto no encontrado');
    }

    const productIndex = cart.products.findIndex((product) => product.productId.id === productId);
    if (productIndex === -1) {
      cart.products.push({ productId, quantity });
    } else {
      cart.products[productIndex].quantity += quantity;
    }

    await cart.save();

    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await this.collection.findOne({ _id: new ObjectId(cartId) }).populate('products.productId');
    if (!cart) {
      throw new Error('Error: carrito no encontrado');
    }

    const productIndex = cart.products.findIndex((product) => product.productId.id === productId);
    if (productIndex === -1) {
      throw new Error('Error: producto no encontrado en el carrito');
    }

    cart.products.splice(productIndex, 1);

    await cart.save();

    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.collection.findOne({ _id: new ObjectId(cartId) }).populate('products.productId');
    if (!cart) {
      throw new Error('Error: carrito no encontrado');
    }

    const productIndex = cart.products.findIndex((product) => product.productId.id === productId);
    if (productIndex === -1) {
      throw new Error('Error: producto no encontrado en el carrito');
    }

    cart.products[productIndex].quantity = quantity;

    await cart.save();

    return cart;
  }

  async getCartProducts(cartId) {
    const cart = await this.collection.findOne({ _id: new ObjectId(cartId) }).populate('products.productId');
    if (!cart) {
      throw new Error('Error: carrito no encontrado');
    }

    return cart.products;
  }

  async clearCart(cartId) {
    const cart = await this.collection.findOne({ _id: new ObjectId(cartId) }).populate('products.productId');
    if (!cart) {
      throw new Error('Error: carrito no encontrado');
    }

    cart.products = [];

    await cart.save();

    return cart;
  }
}

export default CartManager;
