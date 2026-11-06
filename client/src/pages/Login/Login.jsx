import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import axiosInstance from "../../Auth/AxiosInstance";
import AuthLayout from "../AuthLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Field, fieldError } from "@/Components/ui/field";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      UserEmail: "",
      Password: "",
    },
    validationSchema: Yup.object({
      UserEmail: Yup.string().email("Adresse e-mail invalide").required("L'e-mail est requis"),
      Password: Yup.string().min(8, "8 caractères minimum").required("Le mot de passe est requis"),
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
          // Check if fetchStockNotif has already been run
          const notifMarked = localStorage.getItem("NotifMarked");
          if (notifMarked !== "true") {
            fetchStockNotif(); // Call fetchStockNotif if not already marked
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
      <div className="mb-8">
        <h1 className="m-0 text-2xl font-semibold tracking-tight sm:text-[28px]">Bon retour 👋</h1>
        <p className="m-0 mt-2 text-sm text-muted-foreground">Connectez-vous à votre espace de facturation.</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5" noValidate>
        <Field label="Adresse e-mail" htmlFor="UserEmail" error={fieldError(formik, "UserEmail")}>
          <Input
            id="UserEmail"
            type="email"
            name="UserEmail"
            autoComplete="email"
            placeholder="vous@exemple.com"
            icon={Mail}
            className="h-11"
            invalid={!!fieldError(formik, "UserEmail")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.UserEmail}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="Password" className="text-[13px] font-medium leading-none">
              Mot de passe
            </label>
            <Link to="/ResetPassword" className="text-xs font-medium text-primary hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <Input
            id="Password"
            type={showPassword ? "text" : "password"}
            name="Password"
            autoComplete="current-password"
            placeholder="••••••••"
            icon={Lock}
            className="h-11"
            invalid={!!fieldError(formik, "Password")}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.Password}
            trailing={
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="text-muted-foreground"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </Button>
            }
          />
          {fieldError(formik, "Password") && (
            <p className="m-0 text-xs font-medium text-destructive">{fieldError(formik, "Password")}</p>
          )}
        </div>

        <Button type="submit" size="lg" loading={isLoading} className="mt-1 w-full">
          {isLoading ? "Connexion…" : "Se connecter"}
          {!isLoading && <ArrowRight />}
        </Button>
      </form>

      <div className="my-7 flex items-center gap-3 text-xs text-muted-foreground">
        <div className="h-px flex-1 bg-border" />
        Nouveau sur la plateforme ?
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/Signup")}>
        Créer un compte agence
      </Button>
    </AuthLayout>
  );
}

export const fetchStockNotif = async (setMessages, setNotificationCount) => {
  try {
    const stockRes = await axiosInstance.get("/api/v1/getstocknotif");
    const notificationMessage = stockRes.data;

    if (notificationMessage !== "No alerts of stock found.") {
      const messages = notificationMessage.split("\n");
      console.log("This Fetch Stock Messages", messages);

      setMessages(messages); // Update messages state
      setNotificationCount(messages.length); // Update notification count with the number of messages
    }
  } catch (error) {
    console.error("Error fetching notification data:", error);
  }
};
