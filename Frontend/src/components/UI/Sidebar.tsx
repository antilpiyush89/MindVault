import { useRecoilState } from "recoil"
import { LockIcon } from "./icons/LockIcon"
import { TweetIcon } from "./icons/TweetIcon"
import { Youtube } from "./icons/Youtube"
import { SidebarItems } from "./SidebarItems"
import { ContentType, filterType } from "../../hook/atoms"
import { SearchIcon } from "./icons/SearchIcon"
// import { useState,useEffect } from "react"
import { MenuIcon } from "./icons/menuIcon"
import { CloseIcon } from "./icons/CloseIcom"
// import { SidebarAtom } from "../../hook/atoms"







// export default function App() {
  
  
//   return (
//     <div className="flex ">
//     </div>
//   )
// }



export const  Sidebar = ({ SidebarOpen, setSidebarOpen }:any)=> {
  console.log(SidebarOpen)
  const [filter,setfilter]=useRecoilState(filterType)
  if (SidebarOpen) {
    return(
            <div className=" fixed top-0 left-0 md:w-72 w-64 bg-white  md:shadow-xl h-screen shadow-xl transition-all duration-300">
      <div className="fixed bg-gray-300 top-4 md:left-60 left-52 cursor-pointer transition-all duration-300 text-black " onClick={() => { setSidebarOpen(!SidebarOpen) }}>
        <CloseIcon />
      </div>
      {/* <div className="h-screen sm:w-72 w-0 border-r-2 fixed top-0 left-0  border-gray-200"> */}
        <div className="flex items-center m-5 mb-10 mt-10">
          <div className="text-purple-600"><LockIcon/></div>
          <div className="ml-2"><h1 className="font-bold text-2xl">Mind Vault</h1></div>
        </div>
        <div className="flex flex-col">
        <SidebarItems text="All" icon={<SearchIcon/>} onfilter={()=>setfilter(ContentType.All)}/>
        <SidebarItems text="Youtube" icon={<Youtube/>} onfilter={()=>setfilter(ContentType.Youtube)}/>
        <SidebarItems text="Tweet" icon={<TweetIcon/>} onfilter={()=>setfilter(ContentType.Twitter)}/>
        </div>
      </div>
    )
  }
  else if (!SidebarOpen) {
    return (
      <button className="fixed top-4 left-5  text-black" onClick={() => { setSidebarOpen(!SidebarOpen) }}>
        <MenuIcon />
      </button>

    )
  }

}

// export const Sidebar = ()=>{
  
//   )
// }