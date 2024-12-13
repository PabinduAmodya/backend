import express from "express";
import { createPtoduct, deleteProduct, getProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createPtoduct)
productRouter.get("/",getProduct)
productRouter.post("/delete",deleteProduct)

export default productRouter;