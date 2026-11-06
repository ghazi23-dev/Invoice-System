/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AtSign, Calendar, Hash, KeyRound, Lock, Mail, User, UserPlus, UserPen } from "lucide-react";
import axiosInstance from "../../../Auth/AxiosInstance";
import { Modal } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Field, fieldError, bindField } from "@/Components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const PopupForm = ({ isOpen, onClose, userData }) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const handleOk = async () => {
    // Surface inline validation errors before hitting the guard below.
    formik.handleSubmit();

    if (
      !formik.values.UserName ||
      !formik.values.fullname ||
      !formik.values.UserEmail ||
      !formik.values.Password ||
      !formik.values.Role ||
      !formik.values.DateOfBirth
    ) {
      return;
    }

    setSubmitting(true);
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

        response = await axiosInstance.put("/api/v1/updateuser", updateData);
      }

      if (response.data.message) {
        toast.success(response.data.message);
      } else if (response.data.error) {
        toast.error(response.data.error);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (
          error.response.data === "User Already Exists" ||
          error.response.data === "User with this email already exists"
        ) {
          toast.error(error.response.data);
        } else {
          toast.error("Erreur lors de l'enregistrement de l'agent.");
          console.error("Error response from server:", error.response);
        }
      } else {
        toast.error("Une erreur inconnue est survenue");
        console.error("Error:", error);
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
      title={isEdit ? "Modifier l'agent" : "Nouvel agent"}
      description={isEdit ? `Compte #${formik.values.User_ID}` : "Créez un compte utilisateur et définissez son rôle."}
      footer={
        <>
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleOk} loading={submitting}>
            {isEdit ? "Enregistrer les modifications" : "Créer l'agent"}
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
          <Field label="ID" className="sm:col-span-2">
            <Input value={formik.values.User_ID ?? ""} icon={Hash} disabled className="font-mono" />
          </Field>
        )}
        <Field label="Nom de l'agent" required error={fieldError(formik, "fullname")} className="sm:col-span-2">
          <Input {...bindField(formik, "fullname")} icon={User} placeholder="Nom complet" />
        </Field>
        <Field label="Nom d'utilisateur" required error={fieldError(formik, "UserName")} className="sm:col-span-2">
          <Input {...bindField(formik, "UserName")} icon={AtSign} placeholder="identifiant" />
        </Field>
        <Field label="E-mail" required error={fieldError(formik, "UserEmail")} className="sm:col-span-2">
          <Input {...bindField(formik, "UserEmail")} type="email" icon={Mail} placeholder="agent@exemple.com" />
        </Field>
        <Field label="Mot de passe" error={fieldError(formik, "Password")}>
          <Input
            {...bindField(formik, "Password")}
            type="password"
            icon={KeyRound}
            placeholder="8 caractères minimum"
          />
        </Field>
        <Field label="Confirmation du mot de passe" error={fieldError(formik, "password2")}>
          <Input {...bindField(formik, "password2")} type="password" icon={Lock} placeholder="Répétez le mot de passe" />
        </Field>
        <Field label="Rôle" required error={fieldError(formik, "Role")}>
          <Select value={formik.values.Role || undefined} onValueChange={(value) => formik.setFieldValue("Role", value)}>
            <SelectTrigger aria-invalid={!!fieldError(formik, "Role") || undefined}>
              <SelectValue placeholder="Choisir un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Owner">Owner</SelectItem>
              <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
              <SelectItem value="Agent">Agent</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Date de naissance" required error={fieldError(formik, "DateOfBirth")}>
          <Input {...bindField(formik, "DateOfBirth")} type="date" icon={Calendar} />
        </Field>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
};

export default PopupForm;
