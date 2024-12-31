import { ReactElement } from "react"

interface SidebarItemInterface {
  text:string,
  icon:ReactElement
  onfilter:()=>void
}


export const SidebarItems =({text,icon,onfilter}:SidebarItemInterface)=>{

  return(
    <button onClick={onfilter}>
    <div className={`flex items-center m-4 ml-8 mb-6 cursor-pointer ${text=="Youtube"? `hover:text-red-400`: `hover:text-blue-400 `}`} >
      <div className=" font">
      {icon}
    </div>
    <div className="ml-2 font-normal">
      {text}
    </div>
    </div>
    </button>
  )
}