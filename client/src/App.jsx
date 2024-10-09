import { Route, Routes } from "react-router-dom";
import SideBar from "./Components/Sidebar/SideBar";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./Auth/Auth";
import ErrorPage from "./pages/Error/Error";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/SignUp";
import ResetPw from "./pages/ResetPwPage/PasswordResetPage"
import "./App.css";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/"element={<Login/>}/> */}
      
        <Route path="/"element={<Login />}/>
        {/* <Route path="/Signup"element={<><Navbar /><Signup /></>}/> */}
        {/* For Build Website Into Cpanel Point Routers */}
        <Route path="*"element={<ErrorPage />}/>


    {/* <Route path="*"element={<ErrorPage />}/> */}

        <Route path="/dashboard/*"element={<><PrivateRoute element={<SideBar />} /></>}/>
        <Route path="/Signup"element={<><Signup /></>}/>
        <Route path="/ResetPassword"element={<><ResetPw /></>}/>

        
        
      </Routes>
    </Router>
  );
};


export default App;
