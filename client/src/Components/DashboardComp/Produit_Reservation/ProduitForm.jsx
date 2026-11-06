/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PackagePlus, Percent, Tag } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Modal } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Field, fieldError, bindField } from "@/Components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const ProduitForm = ({ isOpen, onClose }) => {
  const [open, setOpen] = useState(isOpen);
  const [submitting, setSubmitting] = useState(false);
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
      setSuperAdminData(response.data);
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  };

  useEffect(() => {
    fetchSuperAdmins();
  }, []);

  const handleOk = async () => {
    // Surface inline validation errors before hitting the guard below.
    await formik.handleSubmit();
    if (
      formik.values.Libelle === undefined ||
      formik.values.Type === undefined ||
      formik.values.Tva === undefined
    ) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/api/v1/createProduit", {
        Libelle: formik.values.Libelle,
        Type: formik.values.Type,
        Tva: formik.values.Tva,
      });

      if (response.data.success) {
        toast.success("Produit créé avec succès");
      } else {
        toast.error("Produit Already Exists");
      }
    } finally {
      setSubmitting(false);
      setOpen(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      size="sm"
      icon={PackagePlus}
      title="Nouveau produit"
      description="Ajoutez un produit au catalogue de réservations."
      footer={
        <>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleOk} loading={submitting}>
            Créer le produit
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOk();
        }}
        className="flex flex-col gap-4"
      >
        <Field label="Désignation" required error={fieldError(formik, "Libelle")}>
          <Input {...bindField(formik, "Libelle")} icon={Tag} placeholder="Nom du produit" />
        </Field>
        <Field label="Type de produit" required error={fieldError(formik, "Type")}>
          <Select value={formik.values.Type || undefined} onValueChange={(value) => formik.setFieldValue("Type", value)}>
            <SelectTrigger aria-invalid={!!fieldError(formik, "Type") || undefined}>
              <SelectValue placeholder="Choisir un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hotel">Hotel</SelectItem>
              <SelectItem value="Billetterie">Billetterie</SelectItem>
              <SelectItem value="Marine">Marine</SelectItem>
              <SelectItem value="Préstation Service">Service</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="TVA" required error={fieldError(formik, "Tva")}>
          <Input {...bindField(formik, "Tva")} type="number" icon={Percent} placeholder="0.000" />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
};

export default ProduitForm;
