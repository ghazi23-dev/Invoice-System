import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Building2, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import axiosInstance from "../../Auth/AxiosInstance";
import AuthLayout from "../AuthLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Field, fieldError } from "@/Components/ui/field";

const FIELDS = [
  { name: "AgencyName", label: "Nom de l'agence", placeholder: "Kayan Voyage", icon: Building2, span: 2 },
  { name: "AgencyContactName", label: "Nom du contact", placeholder: "Prénom Nom", icon: User },
  { name: "ContactNumber", label: "Téléphone", placeholder: "+216 00 000 000", icon: Phone, type: "tel" },
  { name: "AgencyEmail", label: "E-mail", placeholder: "agence@exemple.com", icon: Mail, type: "email" },
  { name: "AgencyLocation", label: "Ville", placeholder: "Tunis", icon: MapPin },
  { name: "AgencyPassword", label: "Mot de passe", placeholder: "8 caractères minimum", icon: Lock, type: "password", span: 2 },
];

export default function Signup() {
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
      AgencyName: Yup.string().required("Le nom de l'agence est requis"),
      AgencyContactName: Yup.string().required("Le nom du contact est requis"),
      ContactNumber: Yup.string().required("Le téléphone est requis"),
      AgencyEmail: Yup.string().email("Adresse e-mail invalide").required("L'e-mail est requis"),
      AgencyLocation: Yup.string().required("La ville est requise"),
      AgencyPassword: Yup.string().min(8, "8 caractères minimum").required("Le mot de passe est requis"),
    }),
    onSubmit: async (values) => {
      axiosInstance.defaults.withCredentials = true;
      try {
        setIsLoading(true);
        await axiosInstance.post(`/api/v1/login`, values).then((res) => {
          console.log("DATA BACK FROM LOGIN", res.data);
        });

        setTimeout(() => {
          toast.success("Connexion réussie !");
        }, 200);
        formik.resetForm();
        setTimeout(() => {
          setIsLoading(false);
          navigate("/Dashboard/Home");
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
            toast.warn("Compte non activé. Veuillez contacter votre administrateur.");
            return;
          }
          toast.error("Vérifiez vos informations.");
        }
      }
    },
  });

  return (
    <AuthLayout>
      <div className="mb-7">
        <h1 className="m-0 text-2xl font-semibold tracking-tight sm:text-[28px]">Créer un compte</h1>
        <p className="m-0 mt-2 text-sm text-muted-foreground">Inscrivez votre agence en moins d&apos;une minute.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
        {FIELDS.map(({ name, label, placeholder, icon, type = "text", span }) => (
          <Field
            key={name}
            label={label}
            htmlFor={name}
            error={fieldError(formik, name)}
            className={span === 2 ? "sm:col-span-2" : undefined}
          >
            <Input
              id={name}
              name={name}
              type={type}
              placeholder={placeholder}
              icon={icon}
              invalid={!!fieldError(formik, name)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[name]}
            />
          </Field>
        ))}

        <Button type="submit" size="lg" loading={isLoading} className="mt-2 w-full sm:col-span-2">
          {isLoading ? "Inscription…" : "S'inscrire"}
        </Button>
      </form>

      <p className="m-0 mt-6 text-center text-sm text-muted-foreground">
        Déjà membre ?{" "}
        <Link to="/" className="font-medium text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
