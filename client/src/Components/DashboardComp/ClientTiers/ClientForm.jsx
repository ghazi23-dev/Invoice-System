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
      User_ID: "",
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
    if (userData && userData.length > 0) {
      formik.setValues({
        User_ID: userData[0].User_ID,
        UserName: userData[0].UserName,
        fullname: userData[0].fullname,
        UserEmail: userData[0].UserEmail,
        Role: userData[0].Role,
        Password: userData[0].Password,
        password2: userData[0].Password,
        DateOfBirth: userData[0].DateOfBirth,
      });
    }
  }, [userData]);

  

  const handleOk = async (close) => {
    console.log(close);


 
    if (!formik.values.UserName || !formik.values.fullname || !formik.values.UserEmail || !formik.values.Password || !formik.values.Role || !formik.values.DateOfBirth){
      return;
    }
    
    try {
      let response;
      if (!userData) {
        response = await axiosInstance.post("/api/v1/adduser", {
          UserName: formik.values.UserName,
          fullname: formik.values.fullname,
          UserEmail: formik.values.UserEmail,
          Password: formik.values.Password !== "" ? formik.values.Password : undefined,
          Role: formik.values.Role,
          DateOfBirth: formik.values.DateOfBirth,
          
        });
      } else {
        // Updating an existing user
        const updateData = {
          User_ID: formik.values.User_ID,
          fullname: formik.values.fullname,
          UserEmail: formik.values.UserEmail,
          Role: formik.values.Role,
          num_cin: formik.values.num_cin,
          DateOfBirth: formik.values.DateOfBirth,
        };
      
       
        if (formik.touched.Password && formik.values.Password !== "") {
          // If modified, hash the new password
          updateData.Password = formik.values.Password;
        }
        console.log("Update Data:", updateData);
        // Include the updated fields in the request
        response = await axiosInstance.put(
          "/api/v1/updateuser",
          updateData
        );
      }

      console.log("Response from server:", response.data);

      if (response.data.message) {
        toast.success(response.data.message);
    } else if (response.data.error) {
        toast.error(response.data.error);
    }
    
    } catch (error) {
      if (error.response && error.response.data) {
        if (error.response.data === "User Already Exists" || error.response.data === "User with this email already exists") {
          toast.error(error.response.data);
        } else {
          toast.error("Error updating/adding user data:", error);
          console.error("Error response from server:", error.response);
        }
      } else if (error.data) {
        if (error.data === "User Already Exists" || error.data === "User with this email already exists") {
          toast.error(error.data);
        } else {
          toast.error("Error updating/adding user data:", error);
          console.error("Error response from server:", error);
        }
      } else {
        toast.error("An unknown error occurred");
        console.error("Error:", error);
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
        <label>ID:</label>
        <Input 
      value={formik.values.User_ID}
      style={{ color: "green" ,fontFamily: "bold", fontWeight: 1000 }} 
     
        disabled />
      </div>
      <div>
        <label>Nom Agent:</label>
        <Input
        value={formik.values.fullname}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="fullname"

        style={
          formik.touched.fullname && formik.errors.fullname
            ? { borderColor: "red",}
            : { fontWeight: 900 }
        }
        />
         {formik.touched.fullname && formik.errors.fullname ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.fullname}{" "}
          </span>
        ) : null}
    
      </div>
      <div>
        <label>Nom d`utilisateur:</label>
        <Input
        value={formik.values.UserName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        name="UserName"

        style={
          formik.touched.UserName && formik.errors.UserName
            ? { borderColor: "red" }
            :{ fontWeight: 900 }
        }
        />
         {formik.touched.UserName && formik.errors.UserName ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.UserName}{" "}
          </span>
        ) : null}
    
      </div>
      <div>
        <label>Email:</label>
        <Input
          type="email"
          value={formik.values.UserEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="UserEmail"
          style={
            formik.touched.UserEmail && formik.errors.UserEmail
              ? { borderColor: "red" }
              :{ fontWeight: 900 }
          }
        />
        {formik.touched.UserEmail && formik.errors.UserEmail ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.UserEmail}{" "}
          </span>
        ) : null}
      </div>

      <div>
        <label>Mot Passe:</label>
        <Input
          type="password"
          value={formik.values.Password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="Password"
          style={
            formik.touched.Password && formik.errors.Password
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.Password && formik.errors.Password ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.Password}{" "}
          </span>
        ) : null}

      </div>
    

      <div>
        <label>Mot Passe:</label>
        <Input
          type="password"
          value={formik.values.password2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="password2"
          style={
            formik.touched.password2 && formik.errors.password2
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.password2 && formik.errors.password2 ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.password2}{" "}
          </span>
        ) : null}

      </div>

    <div>


   

    </div>

      <div>
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
      </div>

     
      
      <div>
        <label>Date de Naissance</label>
        <Input
          type="date"
          value={formik.values.DateOfBirth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="DateOfBirth"
          style={
            formik.touched.DateOfBirth && formik.errors.DateOfBirth
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
      />
        {formik.touched.DateOfBirth && formik.errors.DateOfBirth ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.DateOfBirth}{" "}
          </span>
        ) : null}
      </div>

    </Modal>
  );
};

export default ClientForm;
