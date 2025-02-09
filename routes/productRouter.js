import express from "express";
import { createPtoduct, deleteProduct, getProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createPtoduct)
productRouter.get("/",getProduct)
productRouter.delete("/:productId",deleteProduct)

export default productRouter;