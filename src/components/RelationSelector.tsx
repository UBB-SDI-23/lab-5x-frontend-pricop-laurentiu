import React, { useEffect, useRef, useState } from "react";
import Button from "./ui/Button";
import { Overlay } from "react-overlays";
import { useDebounce } from "use-debounce";
import Input from "./ui/Input";
import { useQuery } from "react-query";
import { axios } from "../lib/axios";
import LoadingSpinner from "./LoadingSpinner";
import { PaginatedData } from "../lib/types";

export default function RelationSelector<T extends Record<string, any>>({
  path,
  propertyName,
  ctaText,
  onChange,
}: {
  path: string;
  propertyName: keyof T;
  ctaText: string;
  onChange?: (entity: T) => void;
}) {
  const [show, setShow] = useState(false);
  const btnRef = useRef(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: entities,
    isFetching,
    refetch,
  } = useQuery<PaginatedData<T>>(
    [path.replace(/\//g, "")],
    () => axios.get(`${path}?search=${search}`).then(data => data.data),
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (!show) return;
    refetch();
  }, [debouncedSearch, show]);

  const handleSelect = (ent: T) => {
    setShow(false);
    onChange?.(ent);
  };

  return (
    <>
      <Button type="button" onClick={() => setShow(s => !s)} ref={btnRef}>
        {ctaText}
      </Button>
      <Overlay show={show} target={btnRef} placement="right-start" onHide={() => setShow(false)} rootClose>
        {({ props }) => (
          <div className="bg-white border border-purple-700 p-2 px-3 w-80" {...props}>
            <Input
              type="text"
              value={search}
              placeholder="Search..."
              className="w-full"
              onChange={ev => setSearch(ev.target.value)}
            />
            <div className="p-2 px-1 h-80 overflow-y-auto">
              {isFetching && <LoadingSpinner />}
              {!isFetching &&
                entities &&
                entities!.data.map(ent => (
                  <button
                    key={ent.id}
                    className="w-full border border-purple-200 p-1 px-2 text-sm"
                    onClick={() => handleSelect(ent)}
                    type="button"
                  >
                    {ent[propertyName]}
                  </button>
                ))}
              {!isFetching && !entities?.data.length && (
                <div className="text-sm text-gray-500 text-center">Nothing found...</div>
              )}
            </div>
          </div>
        )}
      </Overlay>
    </>
  );
}
