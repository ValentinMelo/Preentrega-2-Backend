import express from 'express';
import ProductManager from '../ProductManager.js';

const productManager = new ProductManager();
const router = express.Router();

router.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("index", { products });
});

router.get("/:pid", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.put("/:pid", async (req, res) => {
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

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const deletedProduct = await productManager.deleteProduct(productId);
  if (!deletedProduct) return res.status(404).send({ error: "Producto no encontrado" });
  res.status(200).send(deletedProduct);
});

export default router;
