import Product  from "../models/product.js";
import { isAdmin } from "./userController.js";

export function createPtoduct(req,res){
    if(!isAdmin(req)){
        res.json({
            message:"Please login as administrator to create products"
        })
    }
        const newProductDate = req.body

    const product =  new Product(newProductDate)

    product.save().then(()=>{
        res.json({
            message : "product created"
        })

    }).catch((error)=>{
        res.status(403).json({
            message : error
        })
    })

}

export function getProduct(req,res){
    Product.find({}).then((products)=>{
        res.json(products)

    })
    
}

export function deleteProduct(req, res) {
    // Check if the user is an admin
    if (!isAdmin(req)) {
        return res.json({
            message: "Please login as administrator to delete products",
        });
    }

    // Proceed with deletion if the user is an admin
    Product.deleteOne({ name: req.params.name })
        .then((result) => {
            if (result.deletedCount > 0) {
                res.json({
                    message: "Product deleted successfully",
                });
            } else {
                res.json({
                    message: "Product not found",
                });
            }
        })
        .catch((error) => {
            res.json({
                message: error.message,
            });
        });
}