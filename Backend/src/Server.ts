import express from "express"
import {string, z} from "zod"
import { ContentModel, UserModel,TagModel, LinkModel} from "./database";
import { HashPasswordGenerator, HashPasswordMatcher } from "./Middleware";
const JWT_SECRET= "SOULSOCIETY"
import jwt, { JwtPayload } from "jsonwebtoken";
import { Authentication } from "./Middleware";
import mongoose from "mongoose";
import { NewContentInContentandTagTable } from "./Middleware";
import { v4 } from "uuid";
import cors from "cors"
const app = express(); // Initializing an empty express application
app.use(express.json()) // As the user is sending the body in json, hence app.use is used to parse the body
app.use(cors())




// Signup route handler
app.post("/api/v1/signup",async (req,res)=>{

  // TODO: Add zod validation and hash ur password - DONE
  //1. Zod validation
  const UserZodSchema = z.object({
    username:z.string().min(3,{message:"Username cannot be less than 3 characters"}).max(20,{message:"Username cannot more than 20 characters"}),
    password:z.string().min(6,{message:"Min 6 characters required"})
    .refine((password)=>/[A-Z]/.test(password),{message:"Atleast one capital letter required"})
    .refine((password)=>/[a-z]/.test(password),{message:"Atleast one small letter required"})
    .refine((password)=>/[0-9]/.test(password),{message:"Atleast one number required"})
    .refine((password)=>/[!@#$%^&*]/.test(password),{message:"Atleast special symbol required"})
  })

    const {success,error}= UserZodSchema.safeParse(req.body) // Checks for zod validation, UserZodSchema.safeParse contain - {SUCCESS, DATA, ERROR}

    try{
      if (success){
          const username=req.body.username
          const password=req.body.password
          const hashedPassword= await HashPasswordGenerator(password)
          await UserModel.create({
            username:username,
            password:hashedPassword
          })
          res.status(200).json({
            message:"User SignedUp"
          })
      }else{
        const netError=[]
        for (let i=0;i<error.issues.length;i++){
          netError.push(error.issues[i].message)
        }
        res.status(411).json({
          zoderror:"ZOD Validation Error",
          message:netError,
        })
      }
    }catch(error){
      console.log(error)
      res.status(413).json({
        MongoDBError:"MongoDB Error as I have set username:{type: String, unique: true} in UserSchema, Database Error",
        message:"User Already Exist"
      })
    }

  
})

// SignIn route handler
app.post("/api/v1/signin", async (req,res)=>{
  // Try runs normal code and catch catches error that might happen in try and most probably they are databases error
  try{
    const username= req.body.username
    const password = req.body.password
    const userFound = await UserModel.findOne({
      username:username
    })
    if(!userFound || !userFound?.password) {
      // Checks if userFound is null or undefined and same for password field, this make sures even if the userFound has some value, it still checks if the password is null or undefined/ empty password field
      res.status(404).json({
        message:"User doesn't exist or password field is empty"
      })
    }else{
      const isMatch= await HashPasswordMatcher(password,userFound.password)
      if(isMatch){
        const token = jwt.sign({userId:userFound._id},JWT_SECRET)

        res.status(200).json({
          message:"Login Successful",
          TOKEN:token
        })
      }else{
        res.status(401).json({
          message:"Invalid Credentials"
        })
      }
    }
  }catch(e){
    res.status(500).json({
      message:"Internal server error",
      error:e
    })
  }
})

app.post("/api/v1/content",Authentication,async (req,res)=>{
  try{
    const title= req.body.title
    const type = req.body.type
    const link = req.body.link
    // In typescript type of req.user is not particularly defined so we defined it by saying treat req.user as jwt.JwtPayload, treat it as a JwtPayload and then the req.user may have null(empty value) or can be undefined(that its variable is declared but not initialised with any value ex- let x, then console.log(x), it will return undefined or function foo(){ } console.log(foo()). it will return undefined 
    // the ? represent that it may have null|undefined basically setting it as optional
    // then accessing the property of jwtPayload which is username
    // if req.user as string, we say it has a string type
    const userId=  req.user as string
    const TagName = req.body.tags
    console.log("User: ",userId)

    await NewContentInContentandTagTable(userId,title,type,link,TagName) // Bcz it is an async function, need to await it to check if their is successfull resolution of promise
    res.status(200).json({
      msg:"Content Added sucessfully"
    })


  }catch(e){
    res.status(500).json({
      msg:"Internal Server Error",
      err: e
    })
  }

  

  
})
app.get("/api/v1/content",Authentication,async(req,res) =>{
  try{
    const userId = req.user as string
    // const UserTable =  await UserModel.findOne({username:user})
      const ContentTable = await ContentModel.find({userId:userId}) // this ? is for optional cases where, what if UserTable is null | undefined, what if couldn't find user with username:user
      const TagsTable = await TagModel.find({userId:userId})
      res.status(200).json({
        msg:"Content Fetched Successfully",

        Content:ContentTable,
        Tags:TagsTable
      })
    }catch(e){
      res.status(500).json({
        msg:"Internal Server Error",
        error:e
      })
    }

})

app.delete("/api/v1/content",Authentication,async (req,res)=>{
  try{
    const contentID = req.body.contentID
    const ContentDeleted = await ContentModel.findOneAndDelete({contentID:contentID})
    const TagsDeleted= await TagModel.findOneAndDelete({contentID:contentID})
    if(ContentDeleted || TagsDeleted){
      res.status(200).json({
        msg:"Content and its Tag Deleted Sucessfully"
      })
    }else{
      res.status(404).json({
        msg:"Content you want to delete doesn't exist"
      })
    }

  }catch(error){
    res.status(500).json({
      msg:"Internal Server Error",
      error:error
    })
  }
  
})
app.post("/api/brain/share",Authentication,async (req,res)=>{
  try{
    const share = req.body.share
    console.log(req.user)
    if(share){
      const id = v4()
      console.log("UUID: ", id)
      await LinkModel.create({
        linkHash:id,
        userId:req.user
      })
      res.status(200).json({
        msg:"Sharing is enabled",
        linkHash:id
      })
    }else{
      await LinkModel.deleteOne({
        userId:req.user
      })
      res.status(300).json({
        msg:"Cannot share, as share=false"
      })
    }
  }catch(e){
    res.status(500).json({
      msg:"Internal Server Error"
    })
  }
})
app.get("/api/brain/:sharelink",Authentication,async (req,res)=>{
  try{
    const sharelink = req.params.sharelink
    console.log("sharelink: ",sharelink)
    const LinkTableFound= await LinkModel.findOne({linkHash:sharelink})
    if(LinkTableFound){
      const userId=LinkTableFound.userId
      const ContentFound=await ContentModel.find({userId:userId})
      const Username = await UserModel.findOne({_id:userId})
      console.log("userId: ",userId)
      res.status(200).json({
        msg:"Brain fetched Sucessfully",
        Brain:{username:Username?.username, Content: ContentFound}
      })
    }else{
      res.status(400).json({
        msg:"Invalid Link provided"
      })
    }
  }catch(error){
    res.status(500).json({
      msg:"Internal Server Error"
    })
  }
})

app.listen(3000)