import { useEffect, useState } from "react";
import { Bus, BusFuel, Garage, Line } from "../../lib/types";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function LineCard({ line }: { line: Line }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation((_: { mode: "delete" }) => axios.delete(`/line/${line!.id}`), {
    onSuccess() {
      queryClient.invalidateQueries(["line"]);
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
        onClick={() => navigate(`/lines/edit/${line.id}`)}
      >
        <i className="bi-pencil"></i>
      </Button>
      <div className="mb-1">
        <span className="bg-black text-yellow-400 font-bold font-mono rounded p-0.5 px-1">
          <i className="bi-arrow-up-right-square mr-1"></i>
          {line.name}
        </span>
      </div>
      <div className="text-left">{line.startName}</div>
      <div className="text-center">
        <i className="bi-arrow-down-up"></i>
      </div>
      <div className="text-right mb-2">{line.endName}</div>
      <div className="text-sm">
        <i className="bi-house mr-1"></i>
        <i className="bi-arrow-right mr-1"></i>
        {line.startGarage?.name}
      </div>
      <div className="text-sm">
        <i className="bi-house mr-1"></i>
        <i className="bi-arrow-left mr-1"></i>
        {line.endGarage?.name}
      </div>
    </div>
  );
}
