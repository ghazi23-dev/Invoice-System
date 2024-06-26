/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Input, Select } from "antd";
import { toast } from "react-toastify";
import axiosInstance from "../../../Auth/AxiosInstance";
import { useFormik } from "formik";
import * as Yup from "yup";
const { Option } = Select;
import "./Agence.css";
const AgenceForm = ({ isOpen, onClose, userData }) => {
  const [open, setOpen] = useState(isOpen);
const [SuperAdminData, setSuperAdminData] = useState([]);

 

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
      AgencyName : "",  
      AgencyAddress : "",  
      AgencyPhone : "",  
      AgencyEmail : "",  
      AgencyLocation : "",  
      SuperAdminID : "",  
      Matricule_fiscale : "",  
      superadmins : "",  

    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
 
  useEffect(() => {
    if (userData) {
      formik.setValues({
        Agency_ID: userData.Agency_ID,
        AgencyName: userData.AgencyName,
        AgencyAddress: userData.AgencyAddress,
        AgencyPhone: userData.AgencyPhone,
        AgencyEmail: userData.AgencyEmail,
        AgencyLocation: userData.AgencyLocation,
        superadmins: userData.SuperAdminID,
        Matricule_fiscale: userData.Matricule_fiscale,
       

      });
    }
  }, [userData]);
  

  

  const fetchSuperAdmins = async () => {
          try {
            const response = await axiosInstance.get(
              "/api/v1/getSuperAdmin"
            );
            console.log("Response from server Admin ID:", response.data);
            setSuperAdminData(response.data);
          
          } catch (error) {
            console.error("Error fetching data from server:", error);
          }
        };

          useEffect(() => {
                    fetchSuperAdmins();
                      }, []);

                      const handleOk = async (close) => {
                        console.log(close);
                      
                        if (!formik.values.AgencyName || !formik.values.AgencyAddress || !formik.values.AgencyPhone || !formik.values.AgencyEmail || !formik.values.AgencyLocation || !formik.values.Matricule_fiscale) {
                          return;
                        }
                      
                        try {
                          let response;
                          if (!userData) {
                            response = await axiosInstance.post("/api/v1/createAgency", {
                              AgencyName: formik.values.AgencyName,
                              AgencyAddress: formik.values.AgencyAddress,
                              AgencyPhone: formik.values.AgencyPhone,
                              AgencyEmail: formik.values.AgencyEmail,
                              AgencyLocation: formik.values.AgencyLocation,
                              SuperAdminID: formik.values.superadmins,
                              Matricule_fiscale: formik.values.Matricule_fiscale,
                            });
                      
                            console.log("Response from server:", response.data);
                      
                            if (response.data.success) {
                              toast.success("Agency created successfully");
                             
                            } else {
                              toast.error("Failed to create Agency");
                            }
                          }
                        } catch (error) {
                          console.error("Error creating Agency:", error);
                          toast.error("Failed to create Agency");
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

  const filterOption = (input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;



  return (
    <Modal
      title="Agence:"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      

      <div>
        <label>Agency ID:</label>
        <Input
          value={formik.values.Agency_ID}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="Agency_ID"
          style={{ color: "green" ,fontFamily: "bold", fontWeight: 1000 }} 
          disabled
        />
      </div>
      <div>
        <label>Nom de l`Agence:</label>
        <Input
          value={formik.values.AgencyName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="AgencyName"
          style={
            formik.touched.AgencyName && formik.errors.AgencyName
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.AgencyName && formik.errors.AgencyName ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.AgencyName}
          </span>
        ) : null}
      </div>
      <div>
        <label>Adresse de l`Agence:</label>
        <Input
          value={formik.values.AgencyAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="AgencyAddress"
          style={
            formik.touched.AgencyAddress && formik.errors.AgencyAddress
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.AgencyAddress && formik.errors.AgencyAddress ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.AgencyAddress}
          </span>
        ) : null}
      </div>
      <div>
        <label>Téléphone de l`Agence:</label>
        <Input
          value={formik.values.AgencyPhone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="AgencyPhone"
          style={
            formik.touched.AgencyPhone && formik.errors.AgencyPhone
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.AgencyPhone && formik.errors.AgencyPhone ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.AgencyPhone}
          </span>
        ) : null}
      </div>
      <div>
        <label>Email de l`Agence:</label>
        <Input
          type="email"
          value={formik.values.AgencyEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="AgencyEmail"
          style={
            formik.touched.AgencyEmail && formik.errors.AgencyEmail
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.AgencyEmail && formik.errors.AgencyEmail ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.AgencyEmail}
          </span>
        ) : null}
      </div>
      <div>
        <label>Location de l`Agence:</label>
        <Input
          value={formik.values.AgencyLocation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="AgencyLocation"
          style={
            formik.touched.AgencyLocation && formik.errors.AgencyLocation
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.AgencyLocation && formik.errors.AgencyLocation ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.AgencyLocation}
          </span>
        ) : null}
      </div>
      <div>
        <label>Super Admin:</label>
        <Select
        showSearch
        placeholder="Select Super Admin"
        optionFilterProp="children"
          filterOption={filterOption}
          value={formik.values.superadmins}
          onChange={(value) => formik.setFieldValue("superadmins", value)}
          onBlur={formik.handleBlur}
          name="superadmins"
          style={{ width: "100%" }}
          className={
            formik.touched.superadmins && formik.errors.superadmins ? "select-error" : ""
          }
        >

          {SuperAdminData.map((superadmins, index) => (
            <Option key={index} value={superadmins.User_ID}>
              {superadmins.fullname}
            </Option>
          ))}
          {/*nom_frs
          <Option value="Olives">Olives</Option>
          */}
        </Select>
        {formik.touched.superadmins && formik.errors.superadmins ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.superadmins}{" "}
          </span>
        ) : null}
      </div>


        <div>
        <label>Matricule Fiscale:</label>
        <Input
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
            {formik.errors.Matricule_fiscale}
          </span>
        ) : null}
      </div>

      





    </Modal>
  );
};

export default AgenceForm;
