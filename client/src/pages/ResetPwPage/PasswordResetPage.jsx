import { Form, Input, Button, notification } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "./PasswordResetPage.css";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const PasswordResetSchema = Yup.object().shape({
  email: Yup.string().email("Email invalide").required("Required Email!"),
});

const PasswordResetPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/api/password-reset", values);
      notification.success({
        message: "Email de réinitialisation envoyé",
        description: response.data.message,
      });
    } catch (error) {
      notification.error({
        message: "Erreur",
        description: error.response
          ? error.response.data.message
          : "Une erreur est survenue",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const HomeNavigation = () => {
          navigate("/");
            };

  return (
    <div className="page-container">
      <div className="header">
        <img src="../../../src/assets/GSoft.png" alt="GSOFT Innovations Logo" onClick={HomeNavigation} />
      </div>
      <div className="form-container">
        <h2 className="page-title">Réinitialisation du mot de passe</h2>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={PasswordResetSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Email"
                validateStatus={errors.email && touched.email ? "error" : ""}
                help={errors.email && touched.email ? errors.email : ""}
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="Entrez votre email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  size="large"
                  prefix={<MailOutlined />}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{
                    width: "100%",
                    height: "40px",
                    marginTop: "0px",
                    marginBottom: "4px",
                  }}
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Réinitialiser le mot de passe
                </Button>
                <Button onClick={HomeNavigation}
                type="dashed"

                 style={{
                  width: "100%",
                  height: "40px",
                  marginTop: "0px",
                  marginBottom: "4px",
                }}>
               
                  Retour à l`accueil
                  
                  </Button>
              </Form.Item>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PasswordResetPage;
