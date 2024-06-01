/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal, Input, Select } from "antd";
import { toast } from "react-toastify";
import axiosInstance from "../../../Auth/AxiosInstance";
import { useFormik } from "formik";
import * as Yup from "yup";
const { Option } = Select;
import "./Produit_Reservation.css";
const ProduitForm = ({ isOpen, onClose, userData }) => {
  const [open, setOpen] = useState(isOpen);
  const [SuperAdminData, setSuperAdminData] = useState([]);

  const validationSchema = Yup.object().shape({
  
    Libelle: Yup.string().required("Libelle is Required"),
    Type: Yup.string().required("Type is Required"),
    Tva: Yup.number().required("Tva is Required"),
  });

  const formik = useFormik({
    initialValues: {
      ProductID: "",
      Libelle: "",
      Type: "",
      Tva: "",
      
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

 

  const fetchSuperAdmins = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/getSuperAdmin");
      console.log("Response from server:", response.data);
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

    

    if (
      !formik.values.Libelle ||
      !formik.values.Type ||
      !formik.values.Tva
     
    ) {
      return;
    }

    try {
      let response;
      
        response = await axiosInstance.post("/api/v1/createProduit", {
          Libelle: formik.values.Libelle,
          Type: formik.values.Type,
          Tva: formik.values.Tva,
         
        });
     

      console.log("Response from server:", response.data);

      if (response.data.success) {
        toast.success("Produit Created Successfully");
        onClose();
      } else {
        toast.error("Produit Already Exists");
      }
 
   
    
    
    } finally {
      setOpen(false);
      onClose();
    }
  };
  const handleCancel = (e) => {
    console.log(e);
    setOpen(false);
    onClose();
  };



  return (
    <Modal title="Produits:" open={open} onOk={handleOk} onCancel={handleCancel}>
      <div>
        <label>ID Produit:</label>
        <Input
          value={formik.values.ProductID}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="ProductID"
          style={{ color: "green", fontFamily: "bold", fontWeight: 1000 }}
          disabled
        />
      </div>
      <div>
        <label>Libelle:</label>
        <Input
          value={formik.values.Libelle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="Libelle"
          style={
            formik.touched.Libelle && formik.errors.Libelle
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.Libelle && formik.errors.Libelle ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.Libelle}
          </span>
        ) : null}
      </div>
      <div>
        <label>Type Produit : </label>
        <Select
          value={formik.values.Type}
          onChange={(value) => formik.setFieldValue("Type", value)}
          onBlur={formik.handleBlur}
          name="Type"
          style={{ width: "100%" }}
          className={
            formik.touched.Type && formik.errors.Type ? "select-error" : ""
          }
        >
          <Option value="Hotel">Hotel</Option>
          <Option value="Billetterie">Billetterie</Option>
          <Option value="Marine">Marine</Option>
          <Option value="Préstation Service">Service</Option>
        </Select>

        {formik.touched.Type && formik.errors.Type ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {" "}
            {formik.errors.Type}{" "}
          </span>
        ) : null}
      </div>

      <div>
        <label>TVA:</label>
        <Input
          value={formik.values.Tva}
          type="number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          name="Tva"
          style={
            formik.touched.Tva && formik.errors.Tva
              ? { borderColor: "red" }
              : { fontWeight: 900 }
          }
        />
        {formik.touched.Tva && formik.errors.Tva ? (
          <span style={{ color: "red", fontSize: 11 }}>
            {formik.errors.Tva}
          </span>
        ) : null}
      </div>

    </Modal>
  );
};

export default ProduitForm;
