import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';

const cartRouter = express.Router();

// Route to add items to the cart
cartRouter.post("/add", addToCart);

// Route to get cart details
cartRouter.get("/", getCart);

// Route to remove items from the cart
cartRouter.post("/delete", removeFromCart);

export default cartRouter;
