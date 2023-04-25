import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { Garage, Line } from "../../lib/types";
import { useQuery, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import { ErrorMessage, Field, Formik, FormikProps } from "formik";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import RelationSelector from "../../components/RelationSelector";
import * as yup from "yup";

const validationSchema = yup.object({
  name: yup.string().required(),
  startName: yup.string().required(),
  endName: yup.string().required(),
  monthlyRidership: yup
    .number()
    .required()
    .test({ test: num => num % 100 === 0, message: "Ridership needs to be multiple of 100" }),
  startGarageId: yup.number().not([0], "Please select a garage"),
  endGarageId: yup.number().not([0], "Please select a garage"),
});

export default function AddEditLinePage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEdit = useMemo(() => (location.pathname.includes("/edit") ? true : false), [location]);
  const { id } = useParams();

  const { data: line, isLoading } = useQuery<Line>(["line", id], () => axios.get(`/line/${id}`).then(d => d.data), {
    enabled: isEdit,
  });

  const saveChanges = async ({ id, startGarage, endGarage, ...line }: Record<keyof Line, string>) => {
    if (isEdit) {
      await axios.patch(`/line/${id}`, line);
    } else {
      await axios.post(`/line`, line);
    }
    queryClient.invalidateQueries(["line"]);
    navigate("/lines");
  };

  const errorComponent = (name: string) => (
    <ErrorMessage name={name}>{(msg: string) => <div className="text-sm text-red-500">{msg}</div>}</ErrorMessage>
  );

  if (isEdit && (isLoading || !line)) return <Layout isLoading={isLoading}></Layout>;

  return (
    <Layout>
      {isEdit && <h1 className="text-4xl mb-4">Edit line</h1>}
      {!isEdit && <h1 className="text-4xl mb-4">Add line</h1>}
      <Formik
        initialValues={{
          id: -1,
          name: "",
          startName: "",
          endName: "",
          monthlyRidership: 0,
          startGarageId: 0,
          endGarageId: 0,
          ...line,
        }}
        validationSchema={validationSchema}
        onSubmit={saveChanges as any}
      >
        {(props: FormikProps<Line>) => (
          <div className="flex flex-col gap-3">
            {props.values.id !== -1 && (
              <div className="flex flex-col">
                <label>Id</label>
                <Field type="text" as={Input} name="id" disabled></Field>
              </div>
            )}
            <div className="flex flex-col">
              <label>Name</label>
              <Field type="text" as={Input} name="name"></Field>
              {errorComponent("name")}
            </div>
            <div className="flex flex-col">
              <label>Start name</label>
              <Field type="text" as={Input} name="startName"></Field>
              {errorComponent("startName")}
            </div>

            <div className="flex flex-col">
              <label>End Name</label>
              <Field type="text" as={Input} name="endName"></Field>
              {errorComponent("endName")}
            </div>
            <div className="flex flex-col">
              <label>Monthly Ridership</label>
              <Field type="number" as={Input} name="monthlyRidership"></Field>
              {errorComponent("monthlyRidership")}
            </div>
            <div>
              <RelationSelector
                path="/garage"
                propertyName="name"
                ctaText="Select start garage"
                onChange={(garage: Garage) => {
                  props.setFieldValue("startGarageId", garage.id);
                  props.setFieldValue("startGarage", garage);
                }}
              />
              <div className="ml-2 inline">{props.values.startGarage?.name}</div>
              {errorComponent("startGarageId")}
            </div>
            <div>
              <RelationSelector
                path="/garage"
                propertyName="name"
                ctaText="Select end garage"
                onChange={(garage: Garage) => {
                  props.setFieldValue("endGarageId", garage.id);
                  props.setFieldValue("endGarage", garage);
                }}
              />
              <div className="ml-2 inline">{props.values.endGarage?.name}</div>
              {errorComponent("endGarageId")}
            </div>
            <Button type="submit" onClick={props.submitForm}>
              {isEdit ? "Edit" : "Add"}
            </Button>
          </div>
        )}
      </Formik>
    </Layout>
  );
}
