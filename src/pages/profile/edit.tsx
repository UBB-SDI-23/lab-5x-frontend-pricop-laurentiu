import React from "react";
import Layout from "../../components/Layout";
import { ErrorMessage, Field, Formik, FormikProps } from "formik";
import * as yup from "yup";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { axios, handleError } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object({
  bio: yup.string().required(),
  birthDate: yup.string().required(),
  gender: yup.string().required(),
  location: yup
    .string()
    .required()
    .matches(/^[A-Z]{2}$/, "A valid country code is required"),
  website: yup
    .string()
    .required()
    .matches(/^http(s)?:\/\//, "A valid link must start with https://"),
});

type Values = yup.InferType<typeof validationSchema>;

export default function ProfileEditPage() {
  const navigate = useNavigate();

  const errorComponent = (name: string) => (
    <ErrorMessage name={name}>{(msg: string) => <div className="text-sm text-red-500">{msg}</div>}</ErrorMessage>
  );

  const handleSubmit = async (values: Values) => {
    try {
      await axios.patch(`/user/me/profile`, values);
      navigate("/profile");
    } catch (err: any) {
      handleError(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-4xl mb-2">Edit your profile</h1>
      <Formik
        initialValues={{
          bio: "",
          birthDate: "",
          gender: "",
          location: "",
          website: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {(props: FormikProps<Values>) => (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label>Bio</label>
              <Field type="text" as="textarea" name="bio" className="border rounded border-purple-400"></Field>
              {errorComponent("bio")}
            </div>
            <div className="flex flex-col">
              <label>Birth date</label>
              <Field type="date" as={Input} name="birthDate" className="border"></Field>
              {errorComponent("birthDate")}
            </div>
            <div className="flex flex-col">
              <label>Gender</label>
              <Field type="text" as={Input} name="gender" className="border"></Field>
              {errorComponent("gender")}
            </div>
            <div className="flex flex-col">
              <label>Location</label>
              <Field type="text" as={Input} name="location" className="border"></Field>
              {errorComponent("location")}
            </div>
            <div className="flex flex-col">
              <label>Website</label>
              <Field type="text" as={Input} name="website" className="border"></Field>
              {errorComponent("website")}
            </div>
            <Button type="submit" onClick={props.submitForm} disabled={!props.isValid || props.isSubmitting}>
              Update
            </Button>
          </div>
        )}
      </Formik>
    </Layout>
  );
}
