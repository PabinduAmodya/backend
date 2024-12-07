import Product  from "../models/product.js";

export function getProduct(req,res){

  Product.find().then(

    (productList)=>{
      res.status(200).json({
        list : productList
      }) 
    }
  ).catch(
    (err)=>{
      res.json({
        message : "Error"
      })
    }
  )
}

export function createProduct(req,res){

  console.log(req.user)

  if(req.user == null){
    res.json({
      message : "You are not logged in"
    })
    return
  }
  if(req.user.type != "admin"){
    res.json({
      message : "you are not admin"
    })
    return
  }

  

  const product = new Product(req.body)

  product.save().then(()=>{
    res.json({
      message: "Product created"
    })
  }).catch(()=>{
    res.json({
      message: "Product not created"
    })
  })
}



export function getProductByName(req,res){

  const name = req.params.name;

  Product.find({name : name}).then(

    (productList)=>{

      if(productList.length == 0){
        res.json({
          message : "Product not found"
        })
      }else{
        res.json({
          list : productList
        })
      }

      
    }
  ).catch(
    ()=>{
      res.json({
        message : "Product not found"
      })
    }
  )

}