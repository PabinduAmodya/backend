import Order from "../models/order.js";
import Product from "../models/product.js";
import { isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
  if (!isCustomer) {
    return res.json({
      message: "Please login as customer to create orders",
    });
  }

  try {
    const latestOrder = await Order.find().sort({ date: -1 }).limit(1);

    let orderId;

    if (latestOrder.length === 0) {
      orderId = "CBC0001";
    } else {
      const currentOrderId = latestOrder[0].orderId;
      const numberString = currentOrderId.replace("CBC", "");
      const number = parseInt(numberString);
      const newNumber = (number + 1).toString().padStart(4, "0");
      orderId = "CBC" + newNumber;
    }

    const newOrderData = req.body;
    
    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (!product) {
        return res.json({
          message: "Product with id " + newOrderData.orderedItems[i].productId + " not found",
        });
      }

      // Check if enough stock is available
      if (product.stock < newOrderData.orderedItems[i].qty) {
        return res.json({
          message: `Insufficient stock for product with id ${newOrderData.orderedItems[i].productId}`,
        });
      }

      // Deduct the stock
      product.stock -= newOrderData.orderedItems[i].qty;
      await product.save();

      newProductArray[i] = {
        name: product.productName,
        price: product.price,
        quantity: newOrderData.orderedItems[i].qty,
        image: product.images[0],
      };
    }

    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    const order = new Order(newOrderData);
    const savedOrder=await  order.save();

    res.json({
      message: "Order created",
      order : savedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

export async function getOrders(req, res) {

 
  try {
    if(isCustomer){
      const orders = await Order.find({ email: req.user.email });
      res.json(orders);
      return
    }else if(isAdmin(req)){
      const orders = await Order.find({});
      res.json(orders);
      return;
    }else{
      res.json({
        message:"Please login to view orders"
      })
    }
    
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
export async function getQuote(req, res) {
  try {
    let total = 0;
    let labelTotal = 0;

    const newOrderData = req.body;
    const newProductArray = [];

    for (let i = 0; i < newOrderData.orderedItems.length; i++) {
      const product = await Product.findOne({
        productId: newOrderData.orderedItems[i].productId,
      });

      if (!product) {
        return res.status(404).json({
          message: `Product with id ${newOrderData.orderedItems[i].productId} not found`,
        });
      }

      // Check if enough stock is available
      if (product.stock < newOrderData.orderedItems[i].qty) {
        return res.status(400).json({
          message: `Insufficient stock for product with id ${newOrderData.orderedItems[i].productId}`,
        });
      }

      labelTotal += product.price * newOrderData.orderedItems[i].qty;
      total += product.lastPrice * newOrderData.orderedItems[i].qty;

      newProductArray.push({
        name: product.productName,
        price: product.lastPrice,
        labeledPrice: product.price,
        quantity: newOrderData.orderedItems[i].qty,
        image: product.images[0],
      });
    }

    res.json({
      orderedItems: newProductArray,
      total: total,
      labelTotal: labelTotal,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
