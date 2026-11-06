/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Hash, Mail, MapPin, Phone, UserPlus, UserPen, Home, FileBadge } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Modal } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Field, fieldError, bindField } from "@/Components/ui/field";

const ClientForm = ({ isOpen, onClose, userData }) => {
  const [open, setOpen] = useState(isOpen);
  const [submitting, setSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    id_users: Yup.string().required("ID Required"),
    fullname: Yup.string().required("Nom Agent Required"),
    UserName: Yup.string().required("Nom d`utilisateur Required"),
    email: Yup.string().email("Invalid email address").required("Email Required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password Required"),
    password2: Yup.string()
      .oneOf([Yup.ref("Password"), null], "Passwords must match")
      .required("Password Confirmation Required"),
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
      ClientName: "",
      ClientPhone: "",
      ClientEmail: "",
      ClientAddress: "",
      ClientLocation: "",
      Matricule_fiscale: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  useEffect(() => {
    if (userData) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleOk = async () => {
    await formik.handleSubmit();
    setSubmitting(true);
    try {
      let response;
      const payload = {
        ClientName: formik.values.ClientName,
        ClientPhone: formik.values.ClientPhone,
        ClientEmail: formik.values.ClientEmail,
        ClientAddress: formik.values.ClientAddress,
        ClientLocation: formik.values.ClientLocation,
        Matricule_fiscale: formik.values.Matricule_fiscale,
      };
      if (!userData) {
        response = await axiosInstance.post("/api/V1/createClient", payload);
      } else {
        response = await axiosInstance.put(`/api/V1/updateClient/${formik.values.Client_ID}`, {
          Client_ID: formik.values.Client_ID,
          ...payload,
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else if (error.request) {
        toast.error("Erreur de requête");
      } else {
        toast.error(error.message);
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

  const isEdit = !!userData;

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      size="lg"
      icon={isEdit ? UserPen : UserPlus}
      title={isEdit ? "Modifier le client" : "Nouveau client"}
      description={isEdit ? `Code client #${formik.values.Client_ID}` : "Renseignez les informations du client."}
      footer={
        <>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleOk} loading={submitting}>
            {isEdit ? "Enregistrer les modifications" : "Créer le client"}
          </Button>
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOk();
        }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {isEdit && (
          <Field label="Code client" className="sm:col-span-2">
            <Input value={formik.values.Client_ID ?? ""} icon={Hash} disabled className="font-mono" />
          </Field>
        )}
        <Field label="Nom du client" required error={fieldError(formik, "ClientName")} className="sm:col-span-2">
          <Input {...bindField(formik, "ClientName")} placeholder="Nom complet ou raison sociale" />
        </Field>
        <Field label="Téléphone" error={fieldError(formik, "ClientPhone")}>
          <Input {...bindField(formik, "ClientPhone")} icon={Phone} placeholder="+216 00 000 000" />
        </Field>
        <Field label="E-mail" error={fieldError(formik, "ClientEmail")}>
          <Input {...bindField(formik, "ClientEmail")} type="email" icon={Mail} placeholder="client@exemple.com" />
        </Field>
        <Field label="Adresse" error={fieldError(formik, "ClientAddress")}>
          <Input {...bindField(formik, "ClientAddress")} icon={Home} placeholder="Rue, numéro…" />
        </Field>
        <Field label="Région" error={fieldError(formik, "ClientLocation")}>
          <Input {...bindField(formik, "ClientLocation")} icon={MapPin} placeholder="Tunis" />
        </Field>
        <Field label="Matricule fiscal" error={fieldError(formik, "Matricule_fiscale")} className="sm:col-span-2">
          <Input {...bindField(formik, "Matricule_fiscale")} icon={FileBadge} placeholder="0000000/A/M/000" className="font-mono" />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
};

export default ClientForm;
