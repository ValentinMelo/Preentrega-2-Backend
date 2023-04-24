import express from 'express';
import ProductRoutes from './productRoutes.js';
import CartRoutes from './cartRoutes.js';

const router = express.Router();

router.use(express.json());
router.use('/products', ProductRoutes);
router.use('/carts', CartRoutes);

export default router;
