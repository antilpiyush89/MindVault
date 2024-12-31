import { InputField } from "../UI/ModelPopup"
import { Button } from "../UI/Button"
import { useRef } from "react"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { useNavigate } from "react-router-dom"
interface Auth{
  ButtonText:String
  backendurl:String
}
export const SignUp = (props:Auth)=>{
  const UsernameRef = useRef<HTMLInputElement>() // it means that the .current value of useRef() can only be a HTMLBodyElement , a HTMLBodyElement can be an input html element or anything, if useRef<any>(), it means the .current can be set to anything a string, a number or a function
  const PasswordRef = useRef<HTMLInputElement>()
  const navigate = useNavigate()

  async function Auth(){
    const username = UsernameRef.current?.value
    const password = PasswordRef.current?.value
    console.log(username)
    console.log(BACKEND_URL + props.backendurl)

    if(props.ButtonText == "SignUp"){
      await axios.post(BACKEND_URL + props.backendurl,{
        username,
        password
      })
      alert("You have signed Up")
      navigate("/signin")
    }else if(props.ButtonText == "Signin"){
      const response = await axios.post(BACKEND_URL + props.backendurl,{
        username,
        password
      })
      const jwt = response.data.TOKEN
      console.log(jwt)
      if(jwt){
        localStorage.setItem("token",jwt)
        alert("You have signedIn")
        navigate("/dashboard")
      }else{
        alert("No token received")
      }

    }
  }
  return(
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
              <span className="p-10 bg-white opacity-100 rounded-lg ">
                <InputField reference={UsernameRef} placeholder="Username"/>
                <InputField reference={PasswordRef} placeholder="Password"/>
                <span className="flex justify-center">
                <Button variant="primary" OnClick={Auth} size="md" text={props.ButtonText} fullwidth={true} loading= {false}/>
                </span>
              </span>
    </div>
  )
}