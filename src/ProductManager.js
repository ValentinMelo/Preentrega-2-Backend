import fs from 'fs';

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
    this.path = "./productos.txt";
  }

  addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock ||
      !product.category
    ) {
      console.log("No fueron completados todos los campos");
      return;
    }

    if (this.products.find((p) => p.code === product.code)) {
      console.log("Error: Ya existe un producto con el mismo codigo");
      return;
    }

    const newProduct = {
      id: this.nextId,
      title: product.title,
      description: product.description,
      code: product.code,
      price: product.price,
      status: true,
      stock: product.stock,
      category: product.category,
      thumbnail: product.thumbnail,
    };
    this.nextId++;
    this.products.push(newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.log("Error: Producto no encontrado");
      return;
    }
    return product;
  }

  async updateProduct(id, updateFields) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      console.log("Error: Producto no encontrado :(");
      return;
    }

    const updatedProduct = { ...this.products[index], ...updateFields };

    this.products[index] = updatedProduct;

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products)
      );
      const resultado = await fs.promises.readFile(this.path, "utf-8");
      console.log(resultado);
    } catch (error) {
      console.log("error", error);
    }

    return updatedProduct;
  }

  async deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      console.log("Error: Producto no encontrado");
      return;
    }

    this.products.splice(index, 1);

    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products)
      );
      const resultado = await fs.promises.readFile(this.path, "utf-8");
      console.log(resultado);
    } catch (error) {
      console.log("error", error);
    }
  }
}

export default ProductManager
