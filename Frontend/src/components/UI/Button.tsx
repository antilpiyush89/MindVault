import { ReactElement } from "react";
type Variants = "primary" | "secondary"
type Sizes = "sm" | "md" | "lg"
interface ButtonProps{
  variant:Variants,
  size:Sizes,
  text:String,
  StartIcon?: ReactElement,
  EndIcon?: ReactElement,
  OnClick?: ()=>void,
  fullwidth?:boolean,
  loading?:boolean
}

const ButtonSizingStyle = {
  "sm":"px-2 py-1 text-sm",
  "md":"px-4 py-2 text-lg",
  "lg":"px-6 py-3 text-xl"
}
const defaultStyle = "rounded-md mt-2 mr-3 flex w-fit font-sans"
const VariantStyle ={
  "primary": "bg-purple-600 text-white",
  "secondary":"bg-purple-300 text-purple-500"
}
export const Button = (props: ButtonProps)=>{
  return <button className={`${VariantStyle[props.variant]} ${ButtonSizingStyle[props.size] } ${defaultStyle} ${props.fullwidth ? "w-full flex justify-center": ""} ${props.loading ? "opacity-60":"opacity-100"}`} disabled={props.loading} onClick={props.OnClick}>
    <div className="flex items-center">
    {props.StartIcon ? props.StartIcon : null} {props.text}
    </div>
    </button> // if props.variant = "primary", VariantStyle["primary"] = "bg-purple-600 text-white"
    
}

