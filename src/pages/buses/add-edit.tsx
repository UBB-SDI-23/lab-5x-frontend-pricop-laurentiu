import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { Bus, BusFuel, BusFuelHumanized, Garage } from "../../lib/types";
import { QueryClient, useQuery, useQueryClient } from "react-query";
import { axios, handleError } from "../../lib/axios";
import { ErrorMessage, Field, Formik, FormikProps } from "formik";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import RelationSelector from "../../components/RelationSelector";
import * as yup from "yup";

const validationSchema = yup.object({
  manufacturer: yup.string().required().min(2),
  model: yup.string().required().min(2),
  inventoryNum: yup.string().required().min(3),
  licensePlate: yup
    .string()
    .required()
    .matches(
      /([A-Z]{2}( )?[0-9]{2}( )?[A-Z]{3})|(CJ-N( )?[0-9]{5,6})/,
      "This must be a national license plate (CJ 12 AGG) or local plate (CJ-N 12345). Spaces optional."
    ),
  garageId: yup.number().not([0], "Please select a garage"),
});

export default function AddEditBusPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isEdit = useMemo(() => (location.pathname.includes("/edit") ? true : false), [location]);
  const { id } = useParams();

  const { data: bus, isLoading } = useQuery<Bus>(["bus", id], () => axios.get(`/bus/${id}`).then(d => d.data), {
    enabled: isEdit,
  });

  const saveChanges = async ({ id, garage, ...bus }: Record<keyof Bus, string>) => {
    try {
      if (isEdit) {
        await axios.patch(`/bus/${id}`, bus);
      } else {
        await axios.post(`/bus`, bus);
      }
      queryClient.invalidateQueries(["bus"]);
      navigate("/buses");
    } catch (err) {
      handleError(err);
    }
  };

  const errorComponent = (name: string) => (
    <ErrorMessage name={name}>{(msg: string) => <div className="text-sm text-red-500">{msg}</div>}</ErrorMessage>
  );

  if (isEdit && (isLoading || !bus)) return <Layout isLoading={isLoading}></Layout>;

  return (
    <Layout>
      {isEdit && <h1 className="text-4xl mb-4">Edit bus</h1>}
      {!isEdit && <h1 className="text-4xl mb-4">Add bus</h1>}
      <Formik
        initialValues={{
          id: -1,
          manufacturer: "",
          model: "",
          inventoryNum: "",
          licensePlate: "",
          fuel: BusFuel.diesel,
          garageId: 0,
          ...bus,
        }}
        validationSchema={validationSchema}
        onSubmit={saveChanges as any}
      >
        {(props: FormikProps<Bus>) => (
          <div className="flex flex-col gap-3">
            {props.values.id !== -1 && (
              <div className="flex flex-col">
                <label>Id</label>
                <Field type="text" as={Input} name="id" disabled></Field>
              </div>
            )}
            <div className="flex flex-col">
              <label>Manufacturer</label>
              <Field type="text" as={Input} name="manufacturer"></Field>
              {errorComponent("manufacturer")}
            </div>
            <div className="flex flex-col">
              <label>Model</label>
              <Field type="text" as={Input} name="model"></Field>
              {errorComponent("model")}
            </div>
            <div className="flex flex-col">
              <label>Fuel</label>
              <Field type="text" as={Select} name="fuel">
                {Object.values(BusFuel).map(fuel => (
                  <option key={fuel} value={fuel}>
                    {BusFuelHumanized[fuel]}
                  </option>
                ))}
              </Field>
            </div>
            <div className="flex flex-col">
              <label>Inventory Number</label>
              <Field type="text" as={Input} name="inventoryNum"></Field>
              {errorComponent("inventoryNum")}
            </div>
            <div className="flex flex-col">
              <label>License Plate</label>
              <Field type="text" as={Input} name="licensePlate"></Field>
              {errorComponent("licensePlate")}
            </div>
            <div>
              <RelationSelector
                path="/garage"
                propertyName="name"
                ctaText="Select garage"
                onChange={(garage: Garage) => {
                  props.setFieldValue("garageId", garage.id);
                  props.setFieldValue("garage", garage);
                }}
              />
              <div className="ml-2 inline">{props.values.garage?.name}</div>
              {errorComponent("garageId")}
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
