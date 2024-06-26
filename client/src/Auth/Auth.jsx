/* eslint-disable react/prop-types */
// PrivateRoute.js
import { Navigate} from 'react-router-dom';
import { useEffect, useState } from 'react';

import axiosInstance from './AxiosInstance';
import Swal from 'sweetalert2'


const verifyUser = async () => {
  try {
    const response = await axiosInstance.get("/api/v1/checktoken", {
      withCredentials: true,
    });

    // Handle successful verification
    console.log("AUTH RESPONSE DATAAAA@@@",response.data);
    localStorage.setItem("userDetails", JSON.stringify(response.data));
    // Return decoded token data
    return response.data;
  } catch (error) {
    console.log("Error verifying user:", error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Votre session a expiré merci de vous reconnecter!",
    });
    console.error(error);
    throw new Error("Authentication failed");
  }
};

const PrivateRoute = ({ element, roles = [] }) => {
  const [authenticated, setAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    verifyUser()
      .then((userData) => {
        if (userData) {
          console.log("User Data:", userData);
          setAuthenticated(true);
          setUserRole(userData.Role);
  
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false));
      
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
  
     return <Navigate to="/"
     
     
     />;

  }

  if (roles.length && !roles.includes(userRole)) {
    return <Navigate to="/Dashboard/Home/Agent" />; 
  }

  return element;
};

export default PrivateRoute;
