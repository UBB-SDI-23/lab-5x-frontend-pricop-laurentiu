import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import useRouteQuery from "../../lib/hooks/useRouteQuery";
import { Bus, Line, PaginatedData } from "../../lib/types";
import { useQuery } from "react-query";
import { axios } from "../../lib/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import Pagination from "../../components/Pagination";
import BusCard from "../../components/buses/BusCard";
import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import LineCard from "../../components/lines/LineCard";

export default function LinesPage() {
  const [query] = useRouteQuery();

  const take = parseInt(query.take ?? "15");
  const skip = parseInt(query.skip ?? "0");

  const {
    data: lines,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedData<Line>>(["line"], () => axios.get(`/line?&take=${take}&skip=${skip}`).then(r => r.data));

  useEffect(() => {
    refetch();
  }, [take, skip]);

  return (
    <Layout>
      <Link to="/lines/add">
        <Button type="button" className="float-right">
          Add
        </Button>
      </Link>
      <h1 className="text-4xl mb-4">Lines</h1>

      {isFetching && <LoadingSpinner />}
      {!isFetching && <Pagination className="mb-3" take={take} total={lines!.total} />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {!isFetching && lines && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-3">
            {lines.data.map(line => (
              <LineCard line={line} />
            ))}
          </div>
          <Pagination className="mb-3" take={take} total={lines!.total} />
        </>
      )}
    </Layout>
  );
}
