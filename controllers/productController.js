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
        req.json({
            message : error
        })
    })

}

export function getProduct(req,res){
    Product.find({}).then((products)=>{
        res.json(products)

    })
    
}


export function deleteProduct(req,res){
    Product.deleteOne({name : req.params.name}).then(
        ()=>{
            res.json({
                message : "deleted"
            })
        }
    )
}