import React, { useEffect, useState } from "react";
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
import Input from "../../components/ui/Input";
import { useDebounce } from "use-debounce";

export default function LinesPage() {
  const [query] = useRouteQuery();

  const take = parseInt(query.take ?? "16");
  const skip = parseInt(query.skip ?? "0");

  const [isFiltering, setIsFiltering] = useState(false);
  const [filter, setFilter] = useState(0);
  const [debouncedFilter] = useDebounce(filter, 500);

  const {
    data: lines,
    isFetching,
    error,
    refetch,
  } = useQuery<PaginatedData<Line>>(["line"], () =>
    axios
      .get(`/line?&take=${take}&skip=${skip}` + (isFiltering ? `&monthlyRidershipMin=${debouncedFilter}` : ""))
      .then(r => r.data)
  );

  useEffect(() => {
    refetch();
  }, [take, skip, debouncedFilter, isFiltering]);

  return (
    <Layout>
      <Link to="/lines/add">
        <Button type="button" className="float-right">
          Add
        </Button>
      </Link>
      <h1 className="text-4xl mb-4">Lines</h1>

      {isFetching && <LoadingSpinner />}
      {(error as any) && <div className="text-red-500">{error as any}</div>}
      {!isFetching && lines && (
        <>
          <div className="flex justify-between">
            <Pagination className="mb-3" take={take} total={lines!.total} />
            <div>
              <input
                type="checkbox"
                className="mr-2"
                checked={isFiltering}
                onChange={ev => setIsFiltering(ev.target.checked)}
              />
              At least{" "}
              <Input
                type="number"
                value={filter}
                onChange={ev => setFilter(parseInt(ev.target.value))}
                disabled={!isFiltering}
              />{" "}
              riders
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            {lines.data.map(line => (
              <LineCard line={line} key={line.id} />
            ))}
          </div>
          <Pagination className="mb-3" take={take} total={lines!.total} />
        </>
      )}
    </Layout>
  );
}
