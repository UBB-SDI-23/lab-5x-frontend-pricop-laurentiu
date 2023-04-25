import Layout from "../../components/Layout";
import { axios } from "../../lib/axios";
import GarageCard from "../../components/garages/GarageCard";
import { Garage, PaginatedData } from "../../lib/types";
import { useQuery } from "react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Pagination from "../../components/Pagination";
import useRouteQuery from "../../lib/hooks/useRouteQuery";
import Button from "../../components/ui/Button";

export default function GaragesPage() {
  const [query, modifyQuery] = useRouteQuery();

  const take = parseInt(query.take ?? "14");
  const skip = parseInt(query.skip ?? "0");
  const orderBy = query.orderBy ?? "id";
  const direction = query.direction ?? "asc";

  const {
    data: garages,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedData<Garage>>(["garage"], () =>
    axios
      .get("/garage" + (orderBy ? `?orderBy=${orderBy}&direction=${direction}&take=${take}&skip=${skip}` : ""))
      .then(r => r.data)
  );

  useEffect(() => {
    refetch();
  }, [orderBy, direction, take, skip]);

  return (
    <Layout>
      <Button className="float-right">
        <Link to="/garages/biggest">See biggest garages</Link>
      </Button>

      <h1 className="text-4xl mb-4">Garages</h1>
      <div className="mb-4">
        Order by
        <select value={orderBy} onChange={ev => modifyQuery({ orderBy: ev.target.value })}>
          <option value="id">Id</option>
          <option value="name">Name</option>
          <option value="location">Location</option>
        </select>
        <select value={direction} onChange={ev => modifyQuery({ direction: ev.target.value })}>
          <option value="asc">ascending</option>
          <option value="desc">descending</option>
        </select>
      </div>

      {isFetching && <LoadingSpinner />}
      {!isFetching && <Pagination className="mb-3" take={take} total={garages!.total} />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {!isFetching && garages && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {garages.data.map(garage => (
            <GarageCard key={garage.id} garage={garage} />
          ))}
          <GarageCard isNew={true} />
        </div>
      )}
    </Layout>
  );
}
