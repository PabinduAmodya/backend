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
         res.status(403).json({
            message: "Please login as administrator to delete products",
        })
        return
    }

    const productId= req.params.productId

    // Proceed with deletion if the user is an admin
    Product.deleteOne({ productId : productId})
        .then(() => {
            
                res.json({
                    message: "Product deleted successfully",
                })
         
        })
        .catch((error) => {
            res.status(403).json({
                message: error
            })
        })
}

export function updateProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message: "please login as administrator to update products"
        })
        return
    }

    const productId =req.params.productId
    const newProductDate =req.body

    Product.updateOne(
        {productId : productId},
        newProductDate).then(()=>{
            res.json({
                message : "product updated"
            })

        }).catch((error)=>{
            res.status(403).json({
                message:error
            })
        })
    
}

export async function getProductById(req,res){

    try{
        const productId = req.params.productId

    const product = await Product.findOne({productId :
        productId})

    res.json(product) 

    }catch(e){
        res.status(500).json({
           e
        })
    }
       
}


export async function searchproducts(req,res){
    const query = req.params.query

    try{
        const products = await Product.find({
            $or: [
              { productName: { $regex: query, $options: "i" } },
              { altNames: { $elemMatch: { $regex: query, $options: "i" } } },
            ],
          });
      
          res.json(products);
    }catch(e){
        res.status(500).json({
            e,
        });
    }

}