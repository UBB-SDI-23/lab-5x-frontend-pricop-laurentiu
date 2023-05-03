import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import useRouteQuery from "../../lib/hooks/useRouteQuery";
import { Bus, PaginatedData } from "../../lib/types";
import { useQuery } from "react-query";
import { axios } from "../../lib/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import BusCard from "../../components/buses/BusCard";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import CookieManager from "../../lib/cookie-manager";

export default function BusesPage() {
  const [query] = useRouteQuery();

  const take = parseInt(query.take ?? CookieManager.get("paginationSize") ?? "15");
  const skip = parseInt(query.skip ?? "0");

  const {
    data: buses,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedData<Bus>>(["bus"], () => axios.get(`/bus?&take=${take}&skip=${skip}`).then(r => r.data));

  useEffect(() => {
    refetch();
  }, [take, skip]);

  const takeValues = [15, 18, 21, 24, 27, 30, 33];

  return (
    <Layout>
      <Link to="/buses/add">
        <Button type="button" className="float-right">
          Add
        </Button>
      </Link>
      <h1 className="text-4xl mb-4">Buses</h1>

      {isFetching && <LoadingSpinner />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {!isFetching && buses && (
        <>
          <Pagination className="mb-3" take={take} total={buses!.total} takeValues={takeValues} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
            {buses.data.map(bus => (
              <BusCard key={bus.id} bus={bus} />
            ))}
          </div>
          <Pagination className="mb-3" take={take} total={buses!.total} takeValues={takeValues} />
        </>
      )}
    </Layout>
  );
}
