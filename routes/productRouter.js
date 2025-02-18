import express from "express";
import { createPtoduct, deleteProduct, getProduct, getProductById, updateProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/",createPtoduct)
productRouter.get("/",getProduct)
productRouter.get("/:productId",getProductById)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)

export default productRouter;