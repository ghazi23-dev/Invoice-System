import { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Auth/AxiosInstance";
export default function Login (){
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);



  const formik = useFormik({
    initialValues: {
      UserEmail: "",
      Password: "",
    },
    validationSchema: Yup.object({
      UserEmail: Yup.string()
        .email('Invalid email address')
        .required('Required Email!'),
      Password: Yup.string()
        .min(8, 'Must be 8 characters or more')
        .required('Required Password!'),
    }),
    onSubmit: async (values) => {
 
      axiosInstance.defaults.withCredentials = true;
      try {
        setIsLoading(true);
        await axiosInstance.post(`/api/v1/login`, values).then((res) => {
          console.log("DATA BACK FROM LOGIN",res.data);
   
        }
      
      );
        
        setTimeout(() => {
          toast.success("Login Success!");
        },200);
        formik.resetForm();
        setTimeout(() => {
          setIsLoading(false);
          navigate("/Dashboard/Home"); 
          // Check if fetchStockNotif has already been run
          const notifMarked = localStorage.getItem("NotifMarked");
          if (notifMarked !== "true") {
            fetchStockNotif(); // Call fetchStockNotif if not already marked
            localStorage.setItem("NotifMarked", "false");
          }
        }, 1500);
    
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        if (err.response && err.response.data && err.response.data.error) {
          if (err.response.data.error === "User is deactivated") {
          toast.warn("User not activated. Please Contact Your Administrator.");
          return;
        }
        toast.error("Verify Your Information.");
      }
    }
    },
  });
    

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>G - Bridge</h1>
          <p>
          G-Bridge est bien plus qu’un simple logiciel de facturation. C’est votre partenaire de confiance pour gérer efficacement vos transactions financières. Notre solution offre une expérience fluide et intuitive, conçue pour répondre à vos besoins spécifiques
          </p>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form onSubmit={formik.handleSubmit}>
            <input  
              type="email"
              placeholder="Email"
              name="UserEmail"
              onChange={formik.handleChange}
              value={formik.values.UserEmail}
            />
            {formik.touched.UserEmail && formik.errors.UserEmail ? (
              <div className="error-message"> {formik.errors.UserEmail}</div>
            ) : null}
            <input
              type="password"
              placeholder="Password"
              name="Password"
              onChange={formik.handleChange}
              value={formik.values.Password}
            />
            {formik.touched.Password && formik.errors.Password ? (
              <div className="error-message"> {formik.errors.Password}</div>
            ) : null}
            {isLoading ? (
              <button disabled>Loading...</button>
            ) : (
              <button type="submit">Login</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}


export const fetchStockNotif = async (setMessages, setNotificationCount) => {
  try {
  
    const stockRes = await axiosInstance.get("/api/v1/getstocknotif");
    const notificationMessage = stockRes.data;
    
    if (notificationMessage !== "No alerts of stock found.") {
      const messages = notificationMessage.split('\n');
      console.log("This Fetch Stock Messages",messages)

      setMessages(messages); // Update messages state
      setNotificationCount(messages.length); // Update notification count with the number of messages
  
    }
  } catch (error) {
    console.error("Error fetching notification data:", error);
  }
};