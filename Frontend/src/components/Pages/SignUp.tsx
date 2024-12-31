import { InputField } from "../UI/ModelPopup"
import { Button } from "../UI/Button"
import { useRef } from "react"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { StrongPasswordRecommendationAtom } from "../../hook/atoms"
interface Auth{
  ButtonText:String
  backendurl:String
}
export const SignUp = (props:Auth)=>{
  const UsernameRef = useRef<HTMLInputElement>() // it means that the .current value of useRef() can only be a HTMLBodyElement , a HTMLBodyElement can be an input html element or anything, if useRef<any>(), it means the .current can be set to anything a string, a number or a function
  const PasswordRef = useRef<HTMLInputElement>()
  const [StrongPasswordRecommendation,setstrongpassword] = useRecoilState(StrongPasswordRecommendationAtom)
  const navigate = useNavigate()

  async function Auth(){
    const username = UsernameRef.current?.value
    const password = PasswordRef.current?.value

    console.log(username)
    console.log(BACKEND_URL + props.backendurl)

    if(props.ButtonText == "SignUp"){
      try{
        const response = await axios.post(BACKEND_URL + props.backendurl,{
          username,
          password
        })

        // Emptying out the ErrorHandler and input fields
        setstrongpassword([])
        if (PasswordRef.current && UsernameRef.current) {
          PasswordRef.current.value = ""
          UsernameRef.current.value = ""
        }
        console.log("Response from backend for signin: ",response)
        navigate("/signin")
      }catch(e:any){
        setstrongpassword(e.response.data.message)
        console.log("Error from backend: ",StrongPasswordRecommendation)
      }

 
    }else if(props.ButtonText == "Signin"){
      try{
        const response = await axios.post(BACKEND_URL + props.backendurl,{
          username,
          password
        })
        const jwt = response.data.TOKEN
        console.log(jwt)
        if(jwt){
          localStorage.setItem("token",jwt)
          // alert("You have signedIn")
          navigate("/dashboard")
        }else{
          alert("No token received")
        }
      }catch(e:any){
        const Signinerrorhandler = [e.response.data.message]
        // SigninerrorHandlerAtom.push()
        setstrongpassword(Signinerrorhandler)
        console.log("Error from backend: ",StrongPasswordRecommendation)
      }


    }
  }
  return(
    <div className="w-screen h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center rounded-lg p-2 bg-blue-200 text-center mt-10 mb-5 transition-all ease-in-out duration-300">
                {StrongPasswordRecommendation.map((x)=>{
                  return <h1>{x}</h1>
                })}
      </div>
                <span className="p-10 bg-white opacity-100 rounded-lg ">
                <InputField reference={UsernameRef} placeholder="Username" text="text"/>
                <InputField reference={PasswordRef} placeholder="Password" text="text"/>
                <span className="flex justify-center">
                <Button variant="primary" OnClick={Auth} size="md" text={props.ButtonText} fullwidth={true} loading= {false}/>
                
                </span>
                
              </span>
    </div>
  )
}