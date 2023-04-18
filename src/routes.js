import express from 'express';
import fs from 'fs';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

const cartManager = new CartManager();
const router = express.Router();
const productManager = new ProductManager();
const allProducts = JSON.parse(fs.readFileSync('./data/MOCK_DATA.json', 'utf8'));

router.use(express.json());

router.get("/", (req, res) => {
  res.render("index", { products: allProducts });
});

router.get("/all-products", (req, res) => {
  res.render("index", { products: allProducts });
});


router.get("/products", (req, res) => {
  try {
    const allProductsAndManagerProducts = [...allProducts, ...productManager.getProducts()];
    res.status(200).json(allProductsAndManagerProducts);

  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get("/products/:pid", (req, res) => {
  const idProducto = parseInt(req.params.pid);
  const allProductsAndManagerProducts = [...allProducts, ...productManager.getProducts()];
  const producto = allProductsAndManagerProducts.find(p => p.id === idProducto);
  if (!producto) return res.status(404).send({ error: "Producto no encontrado" });
  res.status(200).send(producto);
});

router.post("/products", (req, res) => {
  const { title, description, price, code, stock, category, thumbnails } = req.body;
  const newProduct = productManager.addProduct({
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

router.put("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const { title, description, price, code, stock, category, thumbnails, status } = req.body;
  const updatedProduct = productManager.updateProduct(productId, {
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

router.delete("/products/:pid", (req, res) => {
  const productId = parseInt(req.params.pid);
  const deletedProduct = productManager.deleteProduct(productId);
  if (!deletedProduct) return res.status(404).send({ error: "Producto no encontrado" });
  res.status(200).send(deletedProduct);
});

router.post("/carts", (req, res) => {
  const { products } = req.body;
  const newCart = cartManager.addCart({ products });
  res.status(201).json(newCart);
});

router.get("/carts/:cid", (req, res) => {
  const cartId = parseInt(req.params.cid);
  const cart = cartManager.getCartById(cartId);
  if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
  const products = cart.products;
  res.status(200).send(products);
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

