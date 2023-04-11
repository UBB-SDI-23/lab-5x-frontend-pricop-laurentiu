import { useQuery } from "react-query";
import Layout from "../../components/Layout";
import { axios } from "../../lib/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BiggestGarage, Garage, PaginatedData } from "../../lib/types";
import useRouteQuery from "../../lib/hooks/useRouteQuery";
import Pagination from "../../components/Pagination";
import { useEffect } from "react";

export default function GaragesBiggestPage() {
  const [query, modifyQuery] = useRouteQuery();

  const take = parseInt(query.take ?? "12");
  const skip = parseInt(query.skip ?? "0");

  const {
    data: garages,
    isLoading,
    error,
    refetch,
  } = useQuery(["garage", "biggestGarages"], () =>
    axios
      .get(`/garage/biggestGarages?take=${take}&skip=${skip}`)
      .then(r => r.data as PaginatedData<BiggestGarage>)
  );

  useEffect(() => {
    refetch();
  }, [take, skip]);

  return (
    <Layout>
      <h1 className="text-4xl mb-4">Biggest garages</h1>
      {!isLoading && (
        <Pagination
          className="mb-3"
          total={garages!.total}
          skip={skip}
          take={take}
        />
      )}
      {isLoading && <LoadingSpinner />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {garages && (
        <div className="grid grid-cols-3 gap-4">
          {garages.data.map(garage => (
            <div className="border rounded-xl border-slate-300 p-5">
              <div className="text-2xl">{garage.name}</div>
              <div>with a total of {garage.busCount} buses</div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
