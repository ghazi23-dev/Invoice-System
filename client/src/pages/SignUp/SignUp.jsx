import { useState } from "react";
import "../SignUp/Signup.css";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Auth/AxiosInstance";
import LogoGS from "../../assets/GSoft.png";
import {Button} from 'antd';
import CountUp from 'react-countup';

export default function Signup (){
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);



  const formik = useFormik({
    initialValues: {
          AgencyName: "",
          AgencyContactName: "",
          ContactNumber: "",
          AgencyEmail: "",
          AgencyLocation: "",
          AgencyPassword: "",

    },
    validationSchema: Yup.object({
          AgencyName: Yup.string()
          .required('Required Agency Name!'),
          AgencyContactName: Yup.string()
          .required('Required Contact Name!'),
          ContactNumber: Yup.string()
          .required('Required Contact Number!'),
          AgencyEmail: Yup.string()
          .email('Invalid email address')
          .required('Required Email!'),
          AgencyLocation: Yup.string()
          .required('Required Location!'),
          AgencyPassword: Yup.string()
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
    <div className="signup-container">
      <div className="left-sections">
     
       <div className="image-container">
          <img src={LogoGS} alt="Logo" />
        </div>
        <p>GSoft Innovations vous offre une solution complète pour la gestion de vos facturations</p> 
          <p>Simplifiez votre processus de facturation avec notre application innovante.</p>     
        <div className="stats">
        
          <div>
          <CountUp end={574000} duration={2.5} />
          <span>Factures Traitée</span>
          </div>
          <div>
          <CountUp end={335} duration={2.5} suffix="+"/>
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
      <div className="right-sections">
      <h1>S`inscrire</h1>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="Nom de l'Agence"
          name="AgencyName"
          onChange={formik.handleChange}
          value={formik.values.AgencyName}
        />
        {formik.touched.AgencyName && formik.errors.AgencyName ? (
          <div className="error-message"> {formik.errors.AgencyName}</div>
        ) : null}

<input
          type="text"
          placeholder="Nom Du Contact"
          name="AgencyContactName"
          onChange={formik.handleChange}
          value={formik.values.AgencyContactName}
        />
        {formik.touched.AgencyContactName && formik.errors.AgencyContactName ? (
          <div className="error-message"> {formik.errors.AgencyContactName}</div>
        ) : null}

        <input
          type="text"
          placeholder="+216 00 000 000"
          name="ContactNumber"
          onChange={formik.handleChange}
          value={formik.values.ContactNumber}
        />
        {formik.touched.ContactNumber && formik.errors.ContactNumber ? (
          <div className="error-message"> {formik.errors.ContactNumber}</div>
        ) : null}
        <input
          type="email"
          placeholder="Email"
          name="AgencyEmail"
          onChange={formik.handleChange}
          value={formik.values.AgencyEmail}
        />
        {formik.touched.AgencyEmail && formik.errors.AgencyEmail ? (
          <div className="error-message"> {formik.errors.AgencyEmail}</div>
        ) : null}
        <input
          type="text"
          placeholder="Ville"
          name="AgencyLocation"
          onChange={formik.handleChange}
          value={formik.values.AgencyLocation}
        />
        {formik.touched.AgencyLocation && formik.errors.AgencyLocation ? (
          <div className="error-message"> {formik.errors.AgencyLocation}</div>
        ) : null}
        <input
          type="password"
          placeholder="Mot de passe"
          name="AgencyPassword"
          onChange={formik.handleChange}
          value={formik.values.Password}
        />
        {formik.touched.AgencyPassword && formik.errors.AgencyPassword ? (
          <div className="error-message"> {formik.errors.AgencyPassword}</div>
        ) : null}
        {isLoading ? (
          <button
            style={{ backgroundColor: '#007bff', color: 'white' }}
            disabled
          >
            Loading...
          </button>
        ) : (
          <button type="submit">S`inscrire</button>
        )}
      </form>
      <a href="#">Mot de passe oublié ?</a>
      <a href="/">êtes-vous déjà membre, connectez-vous</a>
    </div>
          </div>

  );
}

