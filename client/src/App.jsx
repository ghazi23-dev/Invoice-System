import { Route, Routes } from "react-router-dom";
import SideBar from "./Components/Sidebar/SideBar";
import { BrowserRouter as Router } from "react-router-dom";
import PrivateRoute from "./Auth/Auth";
import ErrorPage from "./pages/Error/Error"
import Login from "./pages/Login/Login";
import "./App.css";


const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/"element={<Login/>}/> */}
      
        <Route path="/Login"element={<Login />}/>
        {/* <Route path="/Signup"element={<><Navbar /><Signup /></>}/> */}
        <Route path="*"element={<ErrorPage />}/>

        <Route path="/dashboard/*"element={<><PrivateRoute element={<SideBar />} /></>}/>
        
      </Routes>
    </Router>
  );
};


export default App;
