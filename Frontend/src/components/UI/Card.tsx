import { ShareIcon } from "./icons/ShareIcon"
import { DeleteIcon } from "./icons/DeleteIcon"
import { TweetIcon } from "./icons/TweetIcon"
import { Youtube } from "./icons/Youtube"
// import { useState } from "react"
import { ContentType, Delatom } from "../../hook/atoms"
import { useRecoilState } from "recoil"
export interface CardInterface{
  title:string,
  link:string,
  type:ContentType, // I have decleared type to be an enum, contentType is enum actually
  contentID?:number
}
export const Card = (props:CardInterface)=>{
  // const [del,setdelete]=useState(false)
  const [del,setdelete]=useRecoilState(Delatom)
  console.log(props.link.replace("x","twitter"))
  console.log(props.link)
  console.log("contentID: in card comp",props.contentID)
  return(
    <div className="flex flex-col items-start min-w-72 max-w-96 h-fit p-6 col-span-4 bg-white border-2 border-gray-200 rounded-md ml-12">
      <div className="flex justify-between w-full">
      <div className="flex items-center">
        <div className="mr-2">
        {props.type=="twitter" && <TweetIcon/>}
        {props.type=="youtube" && <Youtube/>}
        </div>
        <h1 className="font-medium">{props.title}</h1>
      </div>
      <div className="flex items-center">
        <ShareIcon size="md" />
        <DeleteIcon onclick={()=>setdelete(true)} del={del} setdelete={setdelete} contendID={props.contentID as number}/>
      </div>
      </div>

      <div className="pt-3 ">
        <div className="w-full">
        {props.type==="youtube" && <iframe  className="w-full rounded-lg" src={props.link.replace("watch","embed").replace("?v=","/")} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> }
        {props.type==="twitter" && <blockquote className="twitter-tweet w-full">
        <a href={props.link.replace("x.com","twitter.com")}></a>
        </blockquote> }
        </div>
      {/* */}
      
      </div>
    </div>
  )
}