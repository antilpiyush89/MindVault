import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config"
import axios from "axios"
import { ContentAtom } from "./atoms"
import { useRecoilState } from "recoil"
export const useContent = ()=>{
  // const [content,setcontent]=useState([])
  const [content,setcontent]=useRecoilState(ContentAtom)
  function refresh(){
    axios.get(BACKEND_URL + "api/v1/content",{
      headers:{
        token:localStorage.getItem("token")
      }
    }).then((response)=>{
      console.log("Content: ", response.data.Content)
      setcontent(response.data.Content)
    })
  }
  // To automatically reload stuff
  useEffect(()=>{
    refresh()
    let interval = setInterval(()=>refresh(),3*1000)
    return ()=>{
      clearInterval(interval)
    }

  },[])

  return content
}
