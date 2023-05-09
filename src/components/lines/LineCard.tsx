import { Line, LineStopDirection } from "../../lib/types";
import { useMutation, useQueryClient } from "react-query";
import { axios } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import LineBadge from "./LineBadge";
import UserBadge from "../ui/UserBadge";
import canUserEdit from "../../lib/role-helpers";
import { useUser } from "../../lib/user-context";

export default function LineCard({ line }: { line: Line }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useUser();
  const mutation = useMutation((_: { mode: "delete" }) => axios.delete(`/line/${line!.id}`), {
    onSuccess() {
      queryClient.invalidateQueries(["line"]);
    },
  });

  const remove = () => mutation.mutateAsync({ mode: "delete" });

  return (
    <div className="group border rounded-xl border-slate-200 p-5">
      {canUserEdit(user.user, line) && (
        <>
          <Button className="opacity-0 group-hover:opacity-100 float-right mx-1" onClick={remove}>
            <i className="bi-trash"></i>
          </Button>
          <Button
            className="opacity-0 group-hover:opacity-100 float-right"
            onClick={() => navigate(`/lines/edit/${line.id}`)}
          >
            <i className="bi-pencil"></i>
          </Button>
        </>
      )}
      <div className="mb-1">
        <LineBadge line={line} />
      </div>
      <div className="text-left mb-1">{line.startName}</div>
      <div className="text-center">
        <i className="bi-arrow-down-up"></i>
      </div>
      <div className="text-right mb-2">{line.endName}</div>
      <div className="text-sm">
        <i className="bi-house mr-1"></i>
        <i className="bi-arrow-right mr-1"></i>
        {line.startGarage?.name}
      </div>
      <div className="text-sm mb-1">
        <i className="bi-house mr-1"></i>
        <i className="bi-arrow-left mr-1"></i>
        {line.endGarage?.name}
      </div>
      <div className="flex gap-1 text-sm mb-1">
        <div>
          <i className="bi-signpost"></i>:
        </div>
        <div>
          <i className="bi-arrow-down"></i>
          {line.lineStops?.filter(stop => stop.direction === LineStopDirection.trip).length}
        </div>
        <div>
          <i className="bi-arrow-up"></i>
          {line.lineStops?.filter(stop => stop.direction === LineStopDirection.roundTrip).length}
        </div>
      </div>
      <div className="text-sm mb-1">
        <i className="bi-people mr-1"></i>
        {line.monthlyRidership} riders / mo
      </div>
      {line.owner && <UserBadge user={line.owner} />}
    </div>
  );
}
