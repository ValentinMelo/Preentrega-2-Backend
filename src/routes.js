import express from 'express';
import mongoose from 'mongoose';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

// Se conecta a la base de datos de MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', function() {
  console.log('Conexión exitosa a MongoDB!');
});

// Crea instancias de los gestores de productos y carritos
const cartManager = new CartManager();
const productManager = new ProductManager();

// Crea un router de Express
const router = express.Router();

// Configura el router para usar JSON
router.use(express.json());

// Ruta para mostrar la página de inicio
router.get("/", (req, res) => {
  res.render("index", { products: productManager.getProducts() });
});

// Ruta para mostrar todos los productos
router.get("/products", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const query = {};
  if (req.query.query) {
    const { category, status } = JSON.parse(req.query.query);
    if (category) query.category = category;
    if (status !== undefined) query.status = status;
  }
  const sort = req.query.sort ? { price: req.query.sort } : null;
  try {
    const products = await productManager.getProducts(query, sort, skip, limit);
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
});


// Ruta para mostrar un producto específico por ID
router.get("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  try {
    const product = await productManager.getProductById(productId);
    if (!product) return res.status(404).send({ error: "Producto no encontrado" });
    res.status(200).send(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ruta para agregar un nuevo producto
router.post("/products", async (req, res) => {
  const { title, description, price, code, stock, category, thumbnails } = req.body;
  const newProduct = await productManager.addProduct({
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
    status: true
  });
  res.status(201).json(newProduct);
});

// Ruta para actualizar un producto existente
router.put("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const { title, description, price, code, stock, category, thumbnails, status } = req.body;
  const updatedProduct = await productManager.updateProduct(productId, {
    title,
    description,
    price,
    code,
    stock,
    category,
    thumbnails,
    status
  });
  if (!updatedProduct) return res.status(404).send({ error: "Producto no encontrado" });
  res.status(200).send(updatedProduct);
});

// Ruta para eliminar un producto existente
router.delete("/products/:pid", async (req, res) => {
  const productId = req.params.pid;
  const deletedProduct = await productManager.deleteProduct(productId);
  if (!deletedProduct) return res.status(404).send({ error: "Producto no encontrado" });
  res.status(200).send(deletedProduct);
});

// Ruta para agregar un nuevo carrito
router.post("/carts", (req, res) => {
  const { products } = req.body;
  const newCart = cartManager.addCart({ products });
  res.status(201).json(newCart);
});

const Cart = require("../models/cart");
const Product = require("../models/product");

router.get("/carts/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await Cart.findById(cartId).populate("products");
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
    res.status(200).send(cart.products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al buscar el carrito" });
  }
});

router.post("/carts/products/:cid/product/:pid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  const cart = cartManager.getCartById(cartId);
  if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
  const product = productManager.getProductById(productId);
  if (!product) return res.status(404).send({ error: "Producto no encontrado" });
  const newProduct = {
    product: productId,
    quantity: 1
  };
  cart.products.push(newProduct);
  res.status(200).send(cart);
});


export default router;

