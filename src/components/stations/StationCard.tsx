import { useEffect, useState } from "react";
import { Station } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import LineBadge from "../lines/LineBadge";
import { Field, Formik, FormikProps, FormikValues } from "formik";
import Input from "../ui/Input";

export default function StationCard({ station, isNew = false }: { station?: Station; isNew?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation(
    ({ mode, station }: { mode: "add" | "edit" | "delete"; station: Pick<Station, "id" | "name"> }) =>
      mode === "add"
        ? axios.post("/station", station)
        : mode === "edit"
        ? axios.patch(`/station/${station.id}`, station)
        : mode === "delete"
        ? axios.delete(`/station/${station.id}`)
        : Promise.reject(),
    {
      onSuccess(_, props) {
        queryClient.invalidateQueries(["station"]);
      },
    }
  );

  const remove = () => mutation.mutateAsync({ mode: "delete", station: station! });

  if (isNew && !isEditing) {
    return (
      <div className="border rounded-xl border-green-300 p-5 cursor-pointer" onClick={() => setIsEditing(true)}>
        <Button className="float-right">
          <i className="bi-plus"></i>
        </Button>
        <i>Add new station...</i>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="border rounded-xl border-yellow-300 p-5">
        <Formik
          initialValues={{
            ...station!,
          }}
          onSubmit={({ id, name }) => mutation.mutate({ mode: isNew ? "add" : "edit", station: { id, name } })}
        >
          {(props: FormikProps<Station>) => (
            <>
              <Button className="float-right mx-1" onClick={() => setIsEditing(false)}>
                <i className="bi-x"></i>
              </Button>
              <Button className="float-right" type="submit" onClick={props.submitForm}>
                <i className="bi-check"></i>
              </Button>
              <Field type="text" as={Input} name="name" />
            </>
          )}
        </Formik>
      </div>
    );
  }

  return (
    <div className="group border rounded-xl border-slate-200 p-5">
      <Button className="opacity-0 group-hover:opacity-100 float-right mx-1" onClick={remove}>
        <i className="bi-trash"></i>
      </Button>
      <Button className="opacity-0 group-hover:opacity-100 float-right" onClick={() => setIsEditing(true)}>
        <i className="bi-pencil"></i>
      </Button>
      <div className="flex gap-2 font-medium mb-2">
        <i className="bi-signpost"></i>
        {station!.name}
      </div>
      {station!.lineStops?.map(stop => (
        <LineBadge line={stop.line!} className="mr-2" key={stop.id} />
      ))}
    </div>
  );
}
