import { useEffect, useState } from "react";
import { Garage } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import Button from "../ui/Button";
import UserBadge from "../ui/UserBadge";

export default function GarageCard({ garage, isNew }: { garage?: Garage; isNew?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentGarage, setCurrentGarage] = useState<Partial<Garage>>({});
  const queryClient = useQueryClient();
  const mutation = useMutation(
    ({ mode, garage }: { mode: "add" | "edit" | "delete"; garage: Garage }) =>
      mode === "add"
        ? axios.post("/garage", garage)
        : mode === "edit"
        ? axios.patch(`/garage/${garage.id}`, garage)
        : mode === "delete"
        ? axios.delete(`/garage/${garage.id}`)
        : Promise.reject(),
    {
      onSuccess() {
        queryClient.invalidateQueries(["garage"]);
      },
    }
  );

  const mergeProperty = (newProps: Partial<Garage>) => {
    setCurrentGarage({
      ...currentGarage,
      ...newProps,
    });
  };

  const save = async () => {
    await mutation.mutateAsync({
      mode: isNew ? "add" : "edit",
      garage: currentGarage as Garage,
    });
    setCurrentGarage({});
    setIsEditing(false);
  };

  const remove = () => mutation.mutateAsync({ mode: "delete", garage: currentGarage as Garage });

  useEffect(() => {
    setCurrentGarage(garage ?? {});
  }, [garage, isEditing]);

  if (isNew && !isEditing) {
    return (
      <div className="border rounded-xl border-green-300 p-5 cursor-pointer" onClick={() => setIsEditing(true)}>
        <Button className="float-right">
          <i className="bi-plus"></i>
        </Button>
        <i>Add new garage...</i>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="border rounded-xl border-yellow-300 p-5">
        <Button className="float-right mx-1" onClick={() => setIsEditing(false)}>
          <i className="bi-x"></i>
        </Button>
        <Button className="float-right" onClick={save}>
          <i className="bi-check"></i>
        </Button>
        <input
          type="text"
          className="border"
          placeholder="Garage name"
          value={currentGarage.name}
          onChange={ev => mergeProperty({ name: ev.target.value })}
        />
        <br />
        <input
          type="text"
          className="border"
          placeholder="Location"
          value={currentGarage.location}
          onChange={ev => mergeProperty({ location: ev.target.value })}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-xl border-slate-200 p-5">
      <Button className="float-right mx-1" onClick={remove}>
        <i className="bi-trash"></i>
      </Button>
      <Button className="float-right" onClick={() => setIsEditing(true)}>
        <i className="bi-pencil"></i>
      </Button>
      <div className="text-2xl">{currentGarage.name}</div>
      <div className="mb-2">located in {currentGarage.location}</div>
      {currentGarage.owner && <UserBadge user={currentGarage.owner} />}
    </div>
  );
}
