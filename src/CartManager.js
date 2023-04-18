class CartManager {
    constructor() {
      this.carts = [];
    }
  
    getCartById(cartId) {
      return this.carts.find((cart) => cart.id === cartId);
    }
  
    createCart() {
      const newCart = {
        id: this.carts.length + 1,
        products: [],
      };
      this.carts.push(newCart);
      return newCart;
    }
  
    addProductToCart(cartId, productId, quantity = 1) {
      const cart = this.getCartById(cartId);
      if (!cart) {
        throw new Error("Error, no encontrado");
      }
  
      const productIndex = cart.products.findIndex((product) => product.id === productId);
      if (productIndex === -1) {

        cart.products.push({ id: productId, quantity });
      } else {

        cart.products[productIndex].quantity += quantity;
      }
  
      return cart;
    }
  
    removeProductFromCart(cartId, productId) {
      const cart = this.getCartById(cartId);
      if (!cart) {
        throw new Error("Error, no encontrado");
      }
  
      const productIndex = cart.products.findIndex((product) => product.id === productId);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado");
      }
  
      cart.products.splice(productIndex, 1);
  
      return cart;
    }
  
    updateProductQuantity(cartId, productId, quantity) {
      const cart = this.getCartById(cartId);
      if (!cart) {
        throw new Error("Error, no encontrado");
      }
  
      const productIndex = cart.products.findIndex((product) => product.id === productId);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado");
      }
  
      cart.products[productIndex].quantity = quantity;
  
      return cart;
    }
  
    getCartProducts(cartId) {
      const cart = this.getCartById(cartId);
      if (!cart) {
        throw new Error("Error, no encontrado");
      }
  
      return cart.products;
    }
  
    clearCart(cartId) {
      const cart = this.getCartById(cartId);
      if (!cart) {
        throw new Error("Error, no encontrado");
      }
  
      cart.products = [];
      return cart;
    }
  }
  
  export default CartManager;
  