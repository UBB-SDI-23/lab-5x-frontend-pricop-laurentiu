import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Layout from "../../components/Layout";
import { Garage, Line, LineStopDirection, Station } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import { ErrorMessage, Field, Formik, FormikProps } from "formik";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import RelationSelector from "../../components/RelationSelector";
import * as yup from "yup";
import classNames from "classnames";

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

  const { data: line, isLoading } = useQuery<Line>(
    ["line", parseInt(id!)],
    () => axios.get(`/line/${id}`).then(d => d.data),
    {
      enabled: isEdit,
    }
  );

  const saveChanges = async ({ id, startGarage, endGarage, ...line }: Record<keyof Line, string>) => {
    if (isEdit) {
      await axios.patch(`/line/${id}`, line);
    } else {
      await axios.post(`/line`, line);
    }
    queryClient.invalidateQueries(["line", id]);
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
          id: line?.id ?? -1,
          name: line?.name ?? "",
          startName: line?.startName ?? "",
          endName: line?.endName ?? "",
          monthlyRidership: line?.monthlyRidership ?? 0,
          startGarageId: line?.startGarageId ?? 0,
          endGarageId: line?.endGarageId ?? 0,
          startGarage: line?.startGarage,
          endGarage: line?.endGarage,
        }}
        validationSchema={validationSchema}
        onSubmit={saveChanges as any}
      >
        {(props: FormikProps<Line>) => (
          <div className="flex flex-col gap-3 mb-3">
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
      {isEdit && line && (
        <>
          <h2 className="text-3xl mb-2">Stops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-2 px-3 border-r flex flex-col gap-2">
              <StopColumn line={line} direction={LineStopDirection.trip} />
            </div>
            <div className="p-2 px-3 flex flex-col gap-2">
              <StopColumn line={line} direction={LineStopDirection.roundTrip} />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

function StopColumn({ line, direction }: { line: Line; direction: LineStopDirection }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(
      props:
        | { mode: "add"; stationId: number }
        | { mode: "delete"; stopId: number }
        | { mode: "patch"; stopId: number; isServicedInWeekends: boolean }
    ) {
      if (props.mode === "delete") return axios.delete(`/line-stop/${props.stopId}`);
      if (props.mode === "add")
        return axios.post(`/line-stop`, {
          lineId: line.id,
          stationId: props.stationId,
          direction,
          isServicedInWeekends: true,
        });
      if (props.mode === "patch")
        return axios.patch(`/line-stop/${props.stopId}`, { isServicedInWeekends: props.isServicedInWeekends });
      return Promise.reject();
    },
    onSuccess() {
      queryClient.invalidateQueries(["line", line.id]);
    },
  });
  return (
    <>
      <div className="font-bold text-center">{direction}</div>
      {line?.lineStops
        ?.filter(stop => stop.direction === direction)
        .map(stop => (
          <>
            <div className="border p-1 px-2">
              <i className="bi-signpost mr-2"></i>
              {stop.station!.name}
              <button
                className={classNames("ml-2 p-0.5 px-1 text-sm rounded", {
                  "bg-green-300": stop.isServicedInWeekends,
                  "bg-red-400": !stop.isServicedInWeekends,
                })}
                onClick={() =>
                  mutation.mutate({ mode: "patch", stopId: stop.id, isServicedInWeekends: !stop.isServicedInWeekends })
                }
              >
                Weekends <i className={stop.isServicedInWeekends ? "bi-check" : "bi-x"}></i>
              </button>
              <button
                className="bi-trash float-right"
                type="button"
                onClick={() => mutation.mutate({ mode: "delete", stopId: stop.id })}
              ></button>
            </div>
          </>
        ))}
      <div>
        <RelationSelector
          ctaText="Add stop"
          path="/station"
          propertyName="name"
          onChange={(st: Station) => mutation.mutate({ mode: "add", stationId: st.id })}
        />
      </div>
    </>
  );
}
