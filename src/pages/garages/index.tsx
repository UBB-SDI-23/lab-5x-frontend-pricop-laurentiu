import Layout from "../../components/Layout";
import { axios } from "../../lib/axios";
import GarageCard from "../../components/garages/GarageCard";
import { Garage } from "../../lib/types";
import { useQuery } from "react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GaragesPage() {
  const [orderBy, setOrderBy] = useState<string | undefined>("name");
  const [direction, setDirection] = useState<string | undefined>("asc");
  const {
    data: garages,
    isLoading,
    error,
    refetch,
  } = useQuery<Garage[]>(["garage"], () =>
    axios
      .get(
        "/garage" +
          (orderBy ? `?orderBy=${orderBy}&direction=${direction}` : "")
      )
      .then(r => r.data)
  );

  useEffect(() => {
    refetch();
  }, [orderBy, direction]);

  return (
    <Layout>
      <Button className="float-right">
        <Link to="/garages/biggest">See biggest garages</Link>
      </Button>

      <h1 className="text-4xl mb-4">Garages</h1>
      <div className="mb-4">
        Order by
        <select value={orderBy} onChange={ev => setOrderBy(ev.target.value)}>
          <option value="name">Name</option>
          <option value="location">Location</option>
        </select>
        <select
          value={direction}
          onChange={ev => setDirection(ev.target.value)}
        >
          <option value="asc">ascending</option>
          <option value="desc">descending</option>
        </select>
      </div>

      {isLoading && <LoadingSpinner />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {garages && (
        <div className="grid grid-cols-3 gap-4">
          {garages?.map(garage => (
            <GarageCard key={garage.id} garage={garage} />
          ))}
          <GarageCard isNew={true} />
        </div>
      )}
    </Layout>
  );
}
