import { useQuery } from "react-query";
import Layout from "../../components/Layout";
import { axios } from "../../lib/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BiggestGarage, Garage } from "../../lib/types";

export default function GaragesBiggestPage() {
  const {
    data: garages,
    isLoading,
    error,
  } = useQuery(["garage", "biggestGarages"], () =>
    axios.get("/garage/biggestGarages").then(r => r.data as BiggestGarage[])
  );
  return (
    <Layout>
      <h1 className="text-4xl mb-4">Biggest garages</h1>
      {isLoading && <LoadingSpinner />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {garages && (
        <div className="grid grid-cols-3 gap-4">
          {garages?.map(garage => (
            <div className="border rounded-xl border-slate-300 p-5">
              <div className="text-2xl">{garage.name}</div>
              <div>with a total of {garage._count.buses} buses</div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
