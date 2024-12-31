import { Sidebar } from "../UI/Sidebar"
import { ModelPopUp } from "../UI/ModelPopup"
import { Button } from "../UI/Button"
import { ShareIcon } from "../UI/icons/ShareIcon"
import { AddIcon } from "../UI/icons/AddIcon"
// import { useState } from "react"
import { Card } from "../UI/Card"
import { useContent } from "../../hook/useContent"
import { useRecoilState } from "recoil"
import { ContentType, filterType, OpenAtom } from "../../hook/atoms"
import { useState,useEffect } from "react"
import { SidebarAtom } from "../../hook/atoms"

function useMediaQuery(query:string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // Set the initial state
    setMatches(mediaQueryList.matches);

    // Update state on media query change
    const listener = (event:any) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export const Dashboard = ()=>{
  // const [open,setOpen]=useState(false)
    const [open,setOpen]=useRecoilState(OpenAtom)
    const [filter,setfilter]= useRecoilState(filterType)
    const [SidebarOpen, setSidebarOpen] = useRecoilState(SidebarAtom)
    const isDesktop = useMediaQuery("(min-width: 768px)")
  console.log(isDesktop)
  useEffect(() => {
    if (isDesktop == false) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isDesktop])
  const contents= useContent()
  console.log(contents)


  return(
    <>
      <Sidebar SidebarOpen={SidebarOpen} setSidebarOpen={setSidebarOpen} />
    <ModelPopUp open={open} onClose={()=>setOpen(false)} />
      <div className={!SidebarOpen ? ` md:ml-0 ml-10 md:bg-gray-100 bg-white min-h-screen` : `md:ml-72 ml-10  md:bg-gray-100 bg-white h-screen`}>
    <div className="md:flex md:justify-end flex flex-col w-full items-center md:pr-10 pr-0 pt-3">
    <Button variant="secondary" size="md" text="Share Brain" StartIcon={<ShareIcon size="md"/>}/>
    <Button variant="primary" size="md" text="Add Content" OnClick={()=>{setOpen(true)}} StartIcon={<AddIcon size="md"/>}/>
    </div>
    <div className ="grid xl:grid-cols-12 md:grid-cols-8 grid-cols-4 gap-4 w-full pt-10 pr-12 pb-10">
    {/* <Card title="Youtube Video" type="youtube" link="https://www.youtube.com/watch?v=qDqtb4-3GWA"/> */}
    {/* <Card title="Tweet" type="twitter" link="https://x.com/100xDevs/status/1871795143923356038/"/> */}
    {contents.map(
      ({title,type,link,contentID})=>{
        console.log("contentID Value in contents map: ",contentID)
        if(filter == ContentType.Youtube && type==ContentType.Youtube){
          return (
            <Card title={title} type={type} link={link} contentID ={contentID} key={contentID}/>
          )
        }else if(filter == ContentType.Twitter && type==ContentType.Twitter){
          return (
            <Card title={title} type={type} link={link} contentID={contentID} key={contentID}/>
          )
        }else if(filter == ContentType.All && (type==ContentType.Youtube || type==ContentType.Twitter) ){
          return (
            <Card title={title} type={type} link={link} contentID={contentID} key={contentID}/>
          )
        }
        return null;
      }   
    )}
    </div>
    </div>
    </>
    )
}