import express from 'express';
import CartManager from '../CartManager.js';

const cartManager = new CartManager();
const router = express.Router();

router.post("/", (req, res) => {
  const { products } = req.body;
  const newCart = cartManager.addCart({ products });
  res.status(201).json(newCart);
});

router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  try {
    const cart = await Cart.findById(cartId).populate("products");
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
    res.render("cart", { products: cart.products });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error al buscar el carrito" });
  }
});

router.post("/products/:cid/product/:pid", (req, res) => {
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