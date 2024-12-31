
import { BACKEND_URL } from "../../config"
import { Button } from "./Button"
import { CloseIcon } from "./icons/CloseIcom"
import { useRef } from "react"
import axios from "axios"
import { Card, CardInterface } from "./Card"
import { useRecoilState, useSetRecoilState } from "recoil"
import { typeAtom } from "../../hook/atoms"
import { ContentType } from "../../hook/atoms"
interface ModelPopUpInterface{
  open:boolean,
  onClose:()=>void
}

export const ModelPopUp = ({open,onClose}:ModelPopUpInterface)=>{
  const titleRef= useRef<HTMLInputElement>()
  const linkRef= useRef<HTMLInputElement>()
  // const typeRef= useRef<HTMLButtonElement>()

  // This enum means whenever someone types youtube it will automatically assign that type to Youtube, vica versa for twitter
  // const enum ContentType{
  //   Youtube="youtube",
  //   Twitter="twitter"
  // }
  const [type, setType] = useRecoilState(typeAtom)
  // const setType = useSetRecoilState(typeAtom)
  // const [type,setType]= useState(ContentType.youtube)
  async function addContent(){
    const title = titleRef.current?.value
    const link = linkRef.current?.value
    if(title && link && type){
      const response = await axios.post(BACKEND_URL + "api/v1/content",{
        title,
        type,
        link
      },{
        headers:{
        token:localStorage.getItem("token")
      }})
      if(response){
        // alert("Content Added Succesfully")
        onClose()
        AddCard({title,type,link})
      }
    }
  }
  return(
    <>
    {open && 
    <div className="">
      <div className=" h-screen w-screen opacity-60 bg-slate-500 fixed top-0 left-0 flex justify-center items-center"></div>
        <span className="p-6 bg-white opacity-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md ">
  
          <div className="flex justify-end cursor-pointer mb-4" onClick={onClose}>
          <CloseIcon/>
          </div>
          <InputField placeholder="Title" reference={titleRef}/>
          <InputField placeholder="Link" reference={linkRef}/>
          <div className="flex w-full justify-center"><h1 className="font-medium ">Type</h1></div>
          <div className="flex gap-1 p-4 pt-0">
            <Button variant={type==ContentType.Youtube ? `primary`:`secondary`} OnClick={()=>
            setType(ContentType.Youtube)
            } size="md" text="Youtube" />    
            <Button  variant={type==ContentType.Twitter ? `primary`:`secondary`} OnClick={()=> setType(ContentType.Twitter)} size="md" text="Twitter"/>
          </div>
          <span className="flex justify-center">
          <Button OnClick={addContent} variant="primary" size="md" text="Submit" />
          </span>
        </span>
      </div>
    }
    </>
  )
  
}
 export interface InputFieldInterface{
  placeholder:string,
  reference?: any // the retrieve data from the htmlinputElement we do by this, this is its datatype

}

export function InputField({placeholder,reference}:InputFieldInterface){
  return(
    <div className="p-2 mb-4 text-lg w-full rounded-lg outline-none border">
      <input ref={reference} type="text" placeholder={placeholder} className="outline-none" />
    </div>
  )
}

function AddCard(props:CardInterface){
  console.log("AddCard Endpoint")
  console.log(props.title)
  console.log(props.type)
  console.log(props.link)
  return(
    <Card title={props.title} type={props.type} link={props.link} />
  )

}