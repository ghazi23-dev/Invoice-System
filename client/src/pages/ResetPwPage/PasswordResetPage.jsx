import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import AuthLayout from "../AuthLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Field } from "@/Components/ui/field";

const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email("Adresse e-mail invalide").required("L'e-mail est requis"),
});

const PasswordResetPage = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/api/password-reset", values);
      toast.success(response.data?.message || "E-mail de réinitialisation envoyé");
    } catch (error) {
      toast.error(error.response ? error.response.data.message : "Une erreur est survenue");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="h-6 w-6" />
        </div>
        <h1 className="m-0 text-2xl font-semibold tracking-tight">Mot de passe oublié ?</h1>
        <p className="m-0 mt-2 text-sm text-muted-foreground">
          Saisissez votre e-mail, nous vous enverrons un lien de réinitialisation.
        </p>
      </div>

      <Formik initialValues={{ email: "" }} validationSchema={PasswordResetSchema} onSubmit={handleSubmit}>
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Field label="Adresse e-mail" htmlFor="email" error={touched.email && errors.email}>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                icon={Mail}
                className="h-11"
                invalid={!!(touched.email && errors.email)}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
            </Field>
            <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
              Envoyer le lien
            </Button>
          </form>
        )}
      </Formik>

      <Link
        to="/"
        className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la connexion
      </Link>
    </AuthLayout>
  );
};

export default PasswordResetPage;
