import { useEffect, useState } from "react";
import { Bus, BusFuel, Garage } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function GarageCard({ bus }: { bus: Bus }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation((_: { mode: "delete" }) => axios.delete(`/garage/${bus!.id}`), {
    onSuccess() {
      queryClient.invalidateQueries(["bus"]);
    },
  });

  const remove = () => mutation.mutateAsync({ mode: "delete" });

  return (
    <div className="group border rounded-xl border-slate-200 p-5">
      <Button className="opacity-0 group-hover:opacity-100 float-right mx-1" onClick={remove}>
        <i className="bi-trash"></i>
      </Button>
      <Button
        className="opacity-0 group-hover:opacity-100 float-right"
        onClick={() => navigate(`/buses/edit/${bus.id}`)}
      >
        <i className="bi-pencil"></i>
      </Button>
      <div className="flex gap-1">
        <i className="bi-bus-front"></i>
        {bus.fuel === BusFuel.diesel && <i className="bi-fuel-pump"></i>}
        {bus.fuel === BusFuel.cableElectric && <i className="bi-plug"></i>}
        {bus.fuel === BusFuel.batteryElectric && <i className="bi-battery-half"></i>}
      </div>
      <div>
        {bus.manufacturer} {bus.model}
      </div>
      <div>Inv. #{bus.inventoryNum}</div>
      {bus.licensePlate.includes("CJ-N") ? (
        <div className="bg-yellow-500 w-24 border border-black font-mono flex justify-around mb-1">
          <div>{bus.licensePlate.substring(0, 4)}</div>
          <div>{bus.licensePlate.substring(4)}</div>
        </div>
      ) : (
        <div className="bg-white w-24 border border-black font-mono flex justify-between mb-1">
          <div className="bg-blue-700 w-2"></div>
          <div>{bus.licensePlate.substring(0, 2)}</div>
          <div>{bus.licensePlate.substring(2, 4)}</div>
          <div>{bus.licensePlate.substring(4, 7)}</div>
          <div>{/* spacing */}</div>
        </div>
      )}
      <div className="text-sm">
        <i className="bi-house mr-2"></i>
        {bus.garage!.name}
      </div>
    </div>
  );
}
