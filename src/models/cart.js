import mongoose from 'mongoose';
const { Schema } = mongoose;

const productsSchema = new Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    status: { type: Boolean, default: true },
    stock: Number,
    category: String
});

const cartsSchema = new Schema({
    products: [{
        product: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 }
    }]
});

const Product = mongoose.model('Product', productsSchema);
const Cart = mongoose.model('Cart', cartsSchema);

export { Product, Cart };

  
