import { useEffect } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config"


// export const useDeleteContent = (contentID:number)=>{

//   useEffect(()=>{
//     axios.delete(BACKEND_URL + "api/v1/content", {
//       data: { contentID },
//       headers: {
//         token: localStorage.getItem("token")
//       }
//     }).then((response)=>{
//       console.log("delete response: ",response)
//     })
//   },[])
// }


export const useDeleteContent = (contentID: number) => {
  useEffect(() => {
    axios({
      method: "delete",
      url: BACKEND_URL + "api/v1/content",
      data: { contentID }, // Include the body here
      headers: {
        token: localStorage.getItem("token") || ""
      },
    }).then((response) => {
      console.log("delete response: ", response);
    }).catch((error) => {
      console.error("delete error: ", error);
    });
  }, []);
};
