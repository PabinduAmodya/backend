import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()
export function createUser(req,res){

  const newUserData = req.body

  if(newUserData.type == "admin"){

    if(req.user==null){
      res.json({
        message: "Please login as administrator to create admin accounts"
      })
      return
    }

    if(req.user.type != "admin"){
      res.json({
        message: "Please login as administrator to create admin accounts"
      })
      return
    }

  }

  newUserData.password = bcrypt.hashSync(newUserData.password, 10)  

  const user = new User(newUserData)

  user.save().then(()=>{
    res.json({
      message: "User created"
    })
  }).catch((error)=>{
    res.json({      
      message: "User not created"
    })
  })
  
}

export function loginUser(req,res){

  User.find({email : req.body.email}).then(
    (users)=>{
      if(users.length == 0){

        res.json({
          message: "User not found"
        })

      }else{

        const user = users[0]

        const isPasswordCorrect = bcrypt.compareSync(req.body.password,user.password)

        if(isPasswordCorrect){

          const token = jwt.sign({
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            isBlocked : user.isBlocked,
            type : user.type,
            profilePicture : user.profilePicture
          } , process.env.SECRET)
          
          res.json({
            message: "User logged in",
            token: token,
            user :{
              firstName:user.firstName,
              lastName:user.lastName,
              type:user.type,
              profilePicture:user.profilePicture,
              email:user.email
            }
          })
          
        }else{
          res.json({
            message: "User not logged in (wrong password)"
          })
        }
      }
    }
  )
}

export function isAdmin(req){
  if(req.user==null){
    return false
  }

  if(req.user.type != "admin"){
    return false
  }

  return true
}

export function isCustomer(req){
  if(req.user==null){
    return false
  }

  if(req.user.type != "customer"){
    return false
  }

  return true
}

export async function getUser(req,res){
  if(req.user==null){
    res.status(404).json({
      message:"Please login to view user details"
    })
    return
  }

  res.json(req.user)

}





//pabindu@example.com -28299=>admin
//"email": "john1234.doe@example133.com","password":"123"=>customer
  