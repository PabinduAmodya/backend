import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";

export async function addToCart(req, res) {
  if (!isCustomer) {
    return res.json({
      message: "Please login as a customer to add items to the cart",
    });
  }

  try {
    const { productId, quantity } = req.body;

    // Find the product in the database
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.json({
        message: `Product with id ${productId} not found`,
      });
    }

    // Check if enough stock is available
    if (product.stock < quantity) {
      return res.json({
        message: `Insufficient stock for product with id ${productId}`,
      });
    }

    // Find or create the user's cart
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({
        cartId: "CART" + new Date().getTime(), // Generate a unique cart ID
        userId: req.user.userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update the quantity of the existing product
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add the new product to the cart
      cart.items.push({
        productId,
        name: product.productName,
        price: product.price,
        quantity,
        image: product.images[0],
      });
    }

    // Update the total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save the updated cart
    await cart.save();

    res.json({
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.json({
        message: "Cart is empty",
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function removeFromCart(req, res) {
  try {
    const { productId } = req.body;

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.json({
        message: "Cart not found",
      });
    }

    // Remove the product from the cart
    cart.items = cart.items.filter((item) => item.productId !== productId);

    // Update the total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Save the updated cart
    await cart.save();

    res.json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
