import { useEffect, useState, } from "react";
import { Layout, Button, theme } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { CiBellOn,CiCircleAlert } from "react-icons/ci";
import {Menu } from "antd";
import { Dropdown } from "antd";
import Logo from "../../assets/Logo";
import MenuList from "./MenuList";
import ToggleThemeBtn from "./ToggleThemeBtn";
import { Routes, Route, useNavigate } from "react-router-dom";
import ErrorPage from "../../pages/Error/Error";
import Dashboard from "../DashboardComp/Dashboard/Dashboard";
import { toast } from "react-toastify";
import "./Sidebar.css";
import { UserOutlined } from "@ant-design/icons";
import Breadcrumb from "./Breadcumbs";
import { fetchStockNotif } from "../../pages/Login/Login";
import PrivateRoute from "../../Auth/Auth";
import axiosInstance from "../../Auth/AxiosInstance";
import Agent from "../DashboardComp/Agents/Agent";
import Agence from "../DashboardComp/Agence/Agence";
import Facturation from "../DashboardComp/DashboardBi/InvoiceComponent";
import Produit_Reservation from "../DashboardComp/Produit_Reservation/Produit_Reservation";
import Invoice_List from "../DashboardComp/DashboardBi/InvoiceList";
import ClientTiers from "../DashboardComp/ClientTiers/Client";
import InvoiceViewForm from "../DashboardComp/DashboardBi/InvoiceViewComponent"
import PDF from "../DashboardComp/PDF_Files/PDF";
const SideBar = () => {
  const { Header, Sider, Content } = Layout;
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [fullDisplayName, setFullDisplayName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 
  const [messages, setMessages] = useState([]);
 
  const toggleTheme = () => setDarkTheme(!darkTheme);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
 
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    if (userDetails) {
      const { User_ID, UserName, fullname,Role,Password } = userDetails;
  
      console.log("User details From Local Storage:", { User_ID, UserName, fullname,Role,Password });
      setFullDisplayName(fullname);
    }
     const NotifMarked = localStorage.getItem("NotifMarked");
      if (NotifMarked === "false") {
     fetchStockNotif(setMessages, setNotificationCount);
     localStorage.setItem("NotifMarked", "false");
     console.log("NotifMarked", NotifMarked);
      }else{
        if(NotifMarked === "true"){
         localStorage.removeItem("NotifMarked");

      }
    }
     }, []);
   
  const navigate = useNavigate();
     const handleLogout = () => {
      axiosInstance
        .post("/api/v1/logout",)
        .then(() => {
          // Clear user details from local storage
         
          setTimeout(() => {
           navigate("/");
          }, 2000);
          localStorage.removeItem("userDetails");
          localStorage.removeItem("NotifMarked");
          toast.success("Logout Success");
        })
        .catch((error) => {
          console.log(error);
        });
    };
    

  const toggleDialog = () => {
    setShowDialog(!showDialog);
    console.log("showDialog", showDialog);
  
  };
  const MarkAsRead = () => {
  
    setShowDialog(false);
    setNotificationCount(0);
    localStorage.setItem("NotifMarked", "true");

    
  };
// MENU AVATAR
  const menu = (
    <Menu >
      {/* <Menu.Item >
        <a href="/Dashboard/Home/profile">My Account</a>
      </Menu.Item> */}
      <Menu.Item >
        <a onClick={handleLogout}>Déconnexion</a>
      </Menu.Item>
    </Menu>
  );

 

  return (
    
 <div className="sidebar-container" >
      
    <Layout>
      <Sider width={240} 
        className="sidebar "
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? "dark" : "light"}
        style={{ position: "fixed", height: "100vh", left: 0,}}
        breakpoint="lg" // breakpoint sidebar should collapse
        onBreakpoint={(broken) => setCollapsed(broken)}
      >
        <Logo />
        <MenuList darkTheme={darkTheme} />
        <ToggleThemeBtn darkTheme={darkTheme} toggleTheme={toggleTheme} />
      </Sider>


      <Layout style={{ marginLeft: collapsed ? 86 : 240, minHeight: "100vh", }}>
        <Header style={{ padding: 0, background: colorBgContainer,  }}>
          
          {/* Welcome TAG Display Name  */}
          <p className="welcome">Bienvenue {fullDisplayName}</p>
        
         {/* Collapse Menu Button */}
          {(!collapsed || window.innerWidth >= 600) && (
              <Button
                type="text"
                className="toggle"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
            )}
          
          {/* User Profile ICON MENU */}

          <Dropdown overlay={menu} trigger={["click"]}>
            <Button
              className="user-profile"
              style={{ width:"50px", }}
              icon={<UserOutlined />}
             
            />
            
          </Dropdown>  
                       {/* BELL NOTIFICATION ICON */}
       <div className="bell-icon" onClick={toggleDialog} >
          <div className="notificationNumber">{notificationCount}</div>
          <CiBellOn className="bell" />
       </div>

{showDialog && (
  <div className="notification-dialog">
    <div className="toast">
      {messages.map((message, index) => <div key={index}><p>{message }<CiCircleAlert className="CircleAlert"/>
     
      </p></div>)} {}
      
    </div>
    <Button onClick={MarkAsRead}>Mark as Read </Button>
  </div>
)}
          
          </Header>
        <Content className="content" >
          {/* Bread Cumb navigation Top Container */}
       <Breadcrumb/>
       
          <Routes>     
           <Route path="/Home" element={<PrivateRoute element={<Dashboard />} roles={['Owner']} />} />
          <Route path ="/Agent" element={<PrivateRoute element={<Agent />} roles={['Owner']} />} />
            <Route path="*" element={<ErrorPage />} />
            <Route path="/Agence" element={<PrivateRoute element={<Agence />} roles={['Owner']} />} />
            <Route path="/DashboardBi" element={<PrivateRoute element={<Facturation />} roles={['Owner']} />} />
            <Route path="/Produit_Reservation" element={<PrivateRoute element={<Produit_Reservation />} roles={['Owner']} />} />
            
            <Route path="/ListeFacture" element={<PrivateRoute element={<Invoice_List />} roles={['Owner']} />} />
            <Route path="/Client" element={<PrivateRoute element={<ClientTiers />} roles={['Owner']} />} />
            <Route path="/ListeFacture/:InvoiceID" element={<PrivateRoute element={<InvoiceViewForm />} roles={['Owner']} />} />
            <Route path="/PDF" element={<PrivateRoute element={<PDF />} roles={['Owner']} />} />
         {/* <Route path="*" element={<Dashboard/>} /> */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  </div>
  );
};

export default SideBar;
