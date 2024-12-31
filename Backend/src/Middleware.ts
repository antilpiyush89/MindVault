import * as argon2 from "argon2"
import { Request, Response, NextFunction } from "express"
import { Mongoose, ObjectId } from "mongoose"
import  jwt  from "jsonwebtoken"
import { ContentModel, TagModel, UserModel } from "./database"
import { string } from "zod"
const JWT_SECRET="SOULSOCIETY"


// Extend the Request interface to include the user property

// I redefined the type of user hence i can now attach req.user with req.user=auth, which have {username:username}
declare module "express-serve-static-core" {
  interface Request {
    user?: string | jwt.JwtPayload
  }}



export const HashPasswordGenerator =async (PlainTextpassword:string)=>{
  return await argon2.hash(PlainTextpassword)
}

export const HashPasswordMatcher = async (PlainTextpassword:string,hashpassword:string)=>{
  return await argon2.verify(hashpassword,PlainTextpassword)
}

export const Authentication = (req:Request,res:Response,next:NextFunction)=>{
  try{
    const token = req.headers["token"] as string
    console.log("Token:   ",token)
    if(!token){
      // 1. Bad request - token is missing/null
      res.status(400).json({
        msg:"token is null / empty token field provided / token is missing"
      })
    }else{
      // 2. This line of code gives me the payload, which in our case it is {username:username}
      const auth = jwt.verify(token,JWT_SECRET)
      console.log(auth)
      req.user= (auth as jwt.JwtPayload)?.userId
      console.log(req.user)
      // 3. If the token is invalid/wrong token provided jwt.verify throws an error and code execution goes to catch
      next()
    }
  }catch(e){
      //4. We reach here when jwt.verify throws an error, only happen when token is invalid
      //status- 401 is for unauthorized access
    res.status(401).json({ 
      msg:"Invalid token",
      err:e
    })
  }
  
// Learning -1. Code execution goes to catch(error) when you provide an invalid token (eg. some letter missing in token)
//           2. Code execution goes to !token when token is null/ you have provided empty token field
  
}



export const NewContentInContentandTagTable = async (userId:string,title:string,type:string,link:string,TagName:string[])=>{
  try{
  // const UserPassDocument = await UserModel.findOne({username:username})
  // fetches the latest document with latestContentID, as -1 represent the last element
  const latestContentID = await ContentModel.findOne({userId:userId}).sort({contentID:-1}).select('contentID') 
  // If contentID exist it will add 1 to it, else sets a default value of 1 to contentID
  const NewContentID = latestContentID ? latestContentID.contentID + 1: 1
  console.log(NewContentID)

  NewTagInTagTable(userId, TagName,NewContentID)

    await ContentModel.create({
      userId:userId,
      contentID:NewContentID,
      title:title,
      type:type,
      link:link,
    })
  }catch(error){
      // Why throw error - bcz in try catch block, return error means it just swallowed the whole error, it does not propogate it to the NewContentInContentandTagTable, it understand it as a sucessfull resolution of the promise
      // Hence need to throw error- so NewContentInContentandTagTable function understand their is unsucessful resolution of the promise
      throw error
  }

}

const NewTagInTagTable = async (userId:String, TagName:string[],NewContentID:Number) =>{
  try{
     await TagModel.create({
      contentID:NewContentID,
      TagName:TagName,
      userId:userId
    })
  }catch(error){
    // Why throw error - bcz in try catch block, return error means it just swallowed the whole error, it does not propogate it to the NewContentInContentandTagTable, it understand it as a sucessfull resolution of the promise
    // Hence need to throw error- so NewContentInContentandTagTable function understand their is unsucessful resolution of the promise 
    throw error
  }


}

