/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Input, Select } from "antd";
import { toast } from "react-toastify";
import axiosInstance from "../../../Auth/AxiosInstance";
import { useFormik } from "formik";
import * as Yup from "yup";
const { Option } = Select;
const ClientForm = ({ isOpen, onClose, userData }) => {
  const [open, setOpen] = useState(isOpen);


 

  const validationSchema = Yup.object().shape({
    id_users: Yup.string().required("ID Required"),
    fullname: Yup.string().required("Nom Agent Required"),
    UserName: Yup.string().required("Nom d`utilisateur Required"),
    email: Yup.string().email("Invalid email address").required("Email Required"),    
    password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password Required"),
    password2: Yup.string()
    .oneOf([Yup.ref('Password'), null], 'Passwords must match')
    .required('Password Confirmation Required'),    
    role: Yup.string().required("Role Required"),
    num_cin: Yup.string()
    .min(8, "Numéro CIN must be at least 8 characters") 
    .max(10, "Numéro CIN must be at most 10 characters")
    .required("Numéro CIN Required"), 
      date_naissance: Yup.date().required("Date de Naissance Required"),

  });

  const formik = useFormik({
    initialValues: {
      Client_ID: "",
      UserName: "",
      fullname: "",
      UserEmail: "",
      Role: "", 
      Password: "",
      password2: "",
      DateOfBirth: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
 
 
  useEffect(() => {
    if(userData) {
      formik.setValues({
        Client_ID: userData.Client_ID,
        ClientName: userData.ClientName,
        ClientPhone: userData.ClientPhone,
        ClientEmail: userData.ClientEmail,
        ClientAddress: userData.ClientAddress,
        ClientLocation: userData.ClientLocation,
        Matricule_fiscale: userData.Matricule_fiscale,
       
      });
    }
  }, [userData]);

  

  const handleOk = async (close) => {
    console.log(close);

await formik.handleSubmit();
 

    
    try {
      let response;
      if (!userData) {
        response = await axiosInstance.post("/api/V1/createClient", {
          ClientName: formik.values.ClientName,
          ClientPhone: formik.values.ClientPhone,
          ClientEmail: formik.values.ClientEmail,
          ClientAddress: formik.values.ClientAddress,
          ClientLocation: formik.values.ClientLocation,
          Matricule_fiscale: formik.values.Matricule_fiscale,
         
          
        });
      } else {
        // Updating an existing user
        const updateData = {
          Client_ID: formik.values.Client_ID,
          ClientName: formik.values.ClientName,
          ClientPhone: formik.values.ClientPhone,
          ClientEmail: formik.values.ClientEmail,
          ClientAddress: formik.values.ClientAddress,
          ClientLocation: formik.values.ClientLocation,
          Matricule_fiscale: formik.values.Matricule_fiscale,
        };
      
        console.log("Update Data:", updateData);
        // Include the updated fields in the request
        response = await axiosInstance.put(
          `/api/V1/updateClient/${formik.values.Client_ID}`,
          updateData
        );
      }

      console.log("Response from server:", response.data);

    if(response.data.success) {
      toast.success(response.data.message);

    }else{
      toast.error(response.data.message);
    }

    
    } catch (error) {

      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message);
      } else if (error.request) {
        console.error("Error request:", error.request);
        toast.error("Request error");
      } else {
        console.error("Error:", error.message);
        toast.error(error.message);
     
      }
    } finally {
      setOpen(false);
      onClose();
    }
  }
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
    onClose();
  };





  return (
    <Modal
      title="Edit Employee"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div>
        <label>Code Client:</label>
        <Input 
      value={formik.values.Client_ID}
      style={{ color: "green" ,fontFamily: "bold", fontWeight: 1000 }} 
     
        disabled />
      </div>
      <div>
        <label>Nom Client:</label>
        <Input
        value={formik.values.ClientName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="ClientName"

        style={
          formik.touched.ClientName && formik.errors.ClientName
            ? { borderColor: "red",}
            : { fontWeight: 900 }
        }
        />
         {formik.touched.ClientName && formik.errors.ClientName ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.ClientName}{" "}
          </span>
        ) : null}
    
      </div>
      <div>
        <label>Numéro Client:</label>
        <Input
        value={formik.values.ClientPhone}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="ClientPhone"

        style={
          formik.touched.ClientPhone && formik.errors.ClientPhone
            ? { borderColor: "red" }
            :{ fontWeight: 900 }
        }
        />
         {formik.touched.ClientPhone && formik.errors.ClientPhone ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.ClientPhone}{" "}
          </span>
        ) : null}
    
      </div>
      <div>
        <label>Email:</label>
        <Input
          type="email"
          value={formik.values.ClientEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="ClientEmail"
          style={
            formik.touched.ClientEmail && formik.errors.ClientEmail
              ? { borderColor: "red" }
              :{ fontWeight: 900 }
          }
        />
        {formik.touched.ClientEmail && formik.errors.ClientEmail ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.ClientEmail}{" "}
          </span>
        ) : null}
      </div>

      <div>
        <label>Address:</label>
        <Input
          type="text"
          value={formik.values.ClientAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="ClientAddress"
          style={
            formik.touched.ClientAddress && formik.errors.ClientAddress
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.ClientAddress && formik.errors.ClientAddress ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.ClientAddress}{" "}
          </span>
        ) : null}

      </div>
    

      <div>
        <label>Région:</label>
        <Input
          type="text"
          value={formik.values.ClientLocation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="ClientLocation"
          style={
            formik.touched.region && formik.errors.ClientLocation
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.ClientLocation && formik.errors.ClientLocation ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.ClientLocation}{" "}
          </span>
        ) : null}

      </div>

    <div>


   

    </div>

      {/* <div>
        <label>Role:</label>
        <Select
         value={formik.values.Role}
          onChange={(value) => formik.setFieldValue("Role", value)}
          onBlur={formik.handleBlur}
          name="Role"
          style={{ width: "100%", fontWeight: 900 ,fontFamily: "bold"}}
          className={
            formik.touched.Role && formik.errors.Role ? "select-error" : ""
          }
        >
          <Option value="Owner">Owner</Option>
          <Option value="SuperAdmin">SuperAdmin</Option>
          <Option value="Agent">Agent</Option>
        </Select>
        {formik.touched.Role && formik.errors.Role ? (
          <span style={{ color: "red", fontSize: 16 }}>
            {" "}
            {formik.errors.Role}{" "}
          </span>
        ) : null}
      </div> */}

     
      
      <div>
        <label>Matricule Fiscale:</label>
        <Input
          type="text"
          value={formik.values.Matricule_fiscale}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="Matricule_fiscale"
          style={
            formik.touched.Matricule_fiscale && formik.errors.Matricule_fiscale
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
      />
        {formik.touched.Matricule_fiscale && formik.errors.Matricule_fiscale ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.Matricule_fiscale}{" "}
          </span>
        ) : null}
      </div>

    </Modal>
  );
};

export default ClientForm;
