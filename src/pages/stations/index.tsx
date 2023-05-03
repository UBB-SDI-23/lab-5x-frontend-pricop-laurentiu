import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import useRouteQuery from "../../lib/hooks/useRouteQuery";
import { PaginatedData, Station } from "../../lib/types";
import { useQuery } from "react-query";
import { axios } from "../../lib/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import StationCard from "../../components/stations/StationCard";
import CookieManager from "../../lib/cookie-manager";

export default function StationsPage() {
  const [query] = useRouteQuery();

  const take = parseInt(query.take ?? CookieManager.get("paginationSize") ?? "15");
  const skip = parseInt(query.skip ?? "0");

  const {
    data: stations,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedData<Station>>(["station"], () =>
    axios.get(`/station?&take=${take}&skip=${skip}`).then(r => r.data)
  );

  useEffect(() => {
    refetch();
  }, [take, skip]);

  return (
    <Layout>
      <h1 className="text-4xl mb-4">Stations</h1>

      {isFetching && <LoadingSpinner />}
      {!isFetching && <Pagination className="mb-3" take={take} total={stations!.total} />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {!isFetching && stations && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            {stations.data.map(station => (
              <StationCard station={station} key={station.id} />
            ))}
            <StationCard isNew={true} />
          </div>
          <Pagination className="mb-3" take={take} total={stations!.total} />
        </>
      )}
    </Layout>
  );
}
