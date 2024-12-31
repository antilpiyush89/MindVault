import { RecoilRoot } from "recoil"
import { Dashboard } from "./components/Pages/Dashboard"
import { SignUp } from "./components/Pages/SignUp"
import { BrowserRouter,Routes,Route } from "react-router-dom"


function App(){
  return <BrowserRouter>
  <Routes>
    <Route path="/signup" element={<RecoilRoot><SignUp ButtonText={"SignUp"} backendurl={"api/v1/signup"}/></RecoilRoot>} > </Route>
    <Route path="/signin" element={<RecoilRoot><SignUp ButtonText={"Signin"} backendurl={"api/v1/signin"}/></RecoilRoot>} > </Route>
    <Route path="/dashboard" element={<RecoilRoot><Dashboard/></RecoilRoot>} > </Route>

  </Routes>
  
  </BrowserRouter>
}
export default App