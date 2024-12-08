import express from "express";
import { createPtoduct, getProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createPtoduct)
productRouter.get("/",getProduct)

export default productRouter;