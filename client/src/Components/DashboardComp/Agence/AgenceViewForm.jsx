/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Building2, FileBadge, Mail, MapPin, Phone } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Modal } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Field, fieldError, bindField } from "@/Components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const AgenceForm = ({ isOpen, onClose, userData }) => {
  const [open, setOpen] = useState(isOpen);
  const [SuperAdminData, setSuperAdminData] = useState([]);

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
      AgencyName: "",
      AgencyAddress: "",
      AgencyPhone: "",
      AgencyEmail: "",
      AgencyLocation: "",
      SuperAdminID: "",
      Matricule_fiscale: "",
      superadmins: "",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

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

  const handleCancel = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      size="lg"
      icon={Building2}
      title="Agence"
      description="Détails de l'agence."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="ID de l'agence" className="sm:col-span-2">
          <Input value={formik.values.Agency_ID ?? ""} disabled className="font-mono" />
        </Field>
        <Field label="Nom de l'agence" error={fieldError(formik, "AgencyName")} className="sm:col-span-2">
          <Input {...bindField(formik, "AgencyName")} icon={Building2} />
        </Field>
        <Field label="Adresse de l'agence" error={fieldError(formik, "AgencyAddress")}>
          <Input {...bindField(formik, "AgencyAddress")} icon={MapPin} />
        </Field>
        <Field label="Téléphone de l'agence" error={fieldError(formik, "AgencyPhone")}>
          <Input {...bindField(formik, "AgencyPhone")} icon={Phone} />
        </Field>
        <Field label="Email de l'agence" error={fieldError(formik, "AgencyEmail")}>
          <Input {...bindField(formik, "AgencyEmail")} type="email" icon={Mail} />
        </Field>
        <Field label="Localisation de l'agence" error={fieldError(formik, "AgencyLocation")}>
          <Input {...bindField(formik, "AgencyLocation")} icon={MapPin} />
        </Field>
        <Field label="Super Admin" error={fieldError(formik, "superadmins")} className="sm:col-span-2">
          <Select
            value={formik.values.superadmins || undefined}
            onValueChange={(value) => formik.setFieldValue("superadmins", value)}
          >
            <SelectTrigger aria-invalid={!!fieldError(formik, "superadmins") || undefined}>
              <SelectValue placeholder="Sélectionner un super admin" />
            </SelectTrigger>
            <SelectContent>
              {SuperAdminData.map((superadmins, index) => (
                <SelectItem key={index} value={String(superadmins.User_ID)}>
                  {superadmins.fullname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Matricule fiscal" error={fieldError(formik, "Matricule_fiscale")} className="sm:col-span-2">
          <Input {...bindField(formik, "SuperAdminID")} icon={FileBadge} className="font-mono" />
        </Field>
      </div>
    </Modal>
  );
};

export default AgenceForm;
