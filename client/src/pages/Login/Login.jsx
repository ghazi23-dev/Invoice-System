import { useState } from "react";
import "./Login.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Auth/AxiosInstance";
import LogoGS from "../../assets/GSoft.png";
import { Button } from "antd";
import CountUp from "react-countup";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      UserEmail: "",
      Password: "",
    },
    validationSchema: Yup.object({
      UserEmail: Yup.string()
        .email("Invalid email address")
        .required("Required Email!"),
      Password: Yup.string()
        .min(8, "Must be 8 characters or more")
        .required("Required Password!"),
    }),
    onSubmit: async (values) => {
      axiosInstance.defaults.withCredentials = true;
      try {
        setIsLoading(true);
        await axiosInstance.post(`/api/v1/login`, values).then((res) => {
          console.log("DATA BACK FROM LOGIN", res.data);
        });

        setTimeout(() => {
          toast.success("Login Success!");
        }, 200);
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
            toast.warn(
              "User not activated. Please Contact Your Administrator."
            );
            return;
          }
          toast.error("Verify Your Information.");
        }
      }
    },
  });

  const SignUpNavigation = () => {
    navigate("/Signup");
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="image-container">
          <img src={LogoGS} alt="Logo" />
        </div>
        <p>
          GSoft Innovations vous offre une solution complète pour la gestion de
          vos facturations
        </p>
        <p>
          Simplifiez votre processus de facturation avec notre application
          innovante.
        </p>
        <div className="stats">
          <div>
            <CountUp end={574000} duration={2.5} />
            <span>Factures Traitée</span>
          </div>
          <div>
            <CountUp end={335} duration={2.5} suffix="+" />
            <span>Clients Satisfaits</span>
          </div>
          <div>
            <CountUp end={239000} duration={2.5} suffix="M" />
            <span>Transactions</span>
          </div>
        </div>
        {/* <button className="register-button">Inscription Gratuite</button> */}
        <div className="contact-info">
          {/* <div>
            <span>HELP DESK 24H / 24 - 7J / 7</span>
            <span>(+216) 00000 000000 </span>
          </div>
          <div>
            <span>EMERGENCY 24H / 24 - 7J / 7</span>
            <span>(+216) 0000000 00000 mail@mail.com</span>
          </div> */}
        </div>
      </div>
      <div className="right-section">
        <h1>Se connecter</h1>

        <form onSubmit={formik.handleSubmit}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="email"
              placeholder="Email"
              name="UserEmail"
              onChange={formik.handleChange}
              value={formik.values.UserEmail}
              style={{
                paddingLeft: "35px",
              }}
            />
            <i
              className="fas fa-envelope"
              style={{
                position: "absolute",
                left: "10px",
                top: "42%",
                transform: "translateY(-50%)",
                pointerEvents: "none", // Prevent clicking the icon
                color: "#aaa",
                fontSize: "18px",
              }}
            />
          </div>
          {formik.touched.UserEmail && formik.errors.UserEmail ? (
            <div className="error-message"> {formik.errors.UserEmail}</div>
          ) : null}
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="password"
              placeholder="Mot de passe"
              name="Password"
              onChange={formik.handleChange}
              value={formik.values.Password}
              style={{ paddingLeft: "35px" }} // Add padding to avoid overlap with the icon
            />
            <i
              className="fas fa-lock"
              style={{
                position: "absolute",
                left: "11px",
                top: "40%",
                transform: "translateY(-50%)",
                pointerEvents: "none", // Prevent clicking the icon
                color: "#aaa",
                fontSize: "18px", // Adjust the font size to control the icon size
              }}
            />
          </div>
          {formik.touched.Password && formik.errors.Password ? (
            <div className="error-message"> {formik.errors.Password}</div>
          ) : null}
          {isLoading ? (
            <Button
              style={{ backgroundColor: "#007bff", color: "white",height: "40px"}}
              disabled
            >
              Loading...
            </Button>
          ) : (
            <button 
            style={{ backgroundColor: "#007bff", color: "white"}}
            
            type="submit">Se connecter</button>
          )}
        </form>

        <Button 
        style={{ backgroundColor: "#FFFFFF", color: "black", marginTop: "10px"}}
        onClick={SignUpNavigation}
        >
          Pas encore membre? S`inscrire
        </Button>
        <a href="/ResetPassword">Mot de passe oublié ?</a>
    
      </div>
    </div>
  );
}

export const fetchStockNotif = async (setMessages, setNotificationCount) => {
  try {
    const stockRes = await axiosInstance.get("/api/v1/getstocknotif");
    const notificationMessage = stockRes.data;

    if (notificationMessage !== "No alerts of stock found.") {
      const messages = notificationMessage.split("\n");
      console.log("This Fetch Stock Messages", messages);

      setMessages(messages); // Update messages state
      setNotificationCount(messages.length); // Update notification count with the number of messages
    }
  } catch (error) {
    console.error("Error fetching notification data:", error);
  }
};
