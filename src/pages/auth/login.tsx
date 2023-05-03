import { ErrorMessage, Field, Formik, FormikProps } from "formik";
import Layout from "../../components/Layout";
import { useUser } from "../../lib/user-context";
import * as yup from "yup";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { axios, handleError, updateAxiosWithToken } from "../../lib/axios";
import CookieManager from "../../lib/cookie-manager";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const validationSchema = yup.object({
  username: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9_]{3,40}$/,
      "Your username needs to have only English letters, numbers and underscores and be between 3 and 40 characters"
    ),
  password: yup
    .string()
    .required()
    .matches(/[\S{4,}]/, "Your password needs to be at least 4 characters"),
});

type Values = yup.InferType<typeof validationSchema>;

export default function LoginPage() {
  const user = useUser();
  const navigate = useNavigate();

  if (user.isLoading) return <Layout></Layout>;

  const errorComponent = (name: string) => (
    <ErrorMessage name={name}>{(msg: string) => <div className="text-sm text-red-500">{msg}</div>}</ErrorMessage>
  );

  const handleSubmit = async (values: Values) => {
    const res = await axios.post("/auth/login", values).catch(handleError);
    if (!res) return;
    CookieManager.set("token", res.data.token);
    updateAxiosWithToken(res.data.token);
    user.invalidate();
    navigate("/buses");
  };

  return (
    <Layout>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<Values>) => (
          <>
            <div className="flex flex-col gap-2 mx-1 md:max-w-md md:mx-auto">
              <h1 className="text-lg mb-3">Please login to continue</h1>
              <div className="flex flex-col">
                <label>Username</label>
                <Field type="text" as={Input} name="username"></Field>
                {errorComponent("username")}
              </div>
              <div className="flex flex-col">
                <label>Password</label>
                <Field type="password" as={Input} name="password"></Field>
                {errorComponent("password")}
              </div>
              <Button type="submit" onClick={props.submitForm} disabled={!props.isValid}>
                Login
              </Button>
            </div>
          </>
        )}
      </Formik>
    </Layout>
  );
}
