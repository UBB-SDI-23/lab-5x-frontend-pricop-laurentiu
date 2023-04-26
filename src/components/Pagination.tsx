import classNames from "classnames";
import useRouteQuery from "../lib/hooks/useRouteQuery";
import Select from "./ui/Select";

export default function Pagination({
  total,
  take,
  skip,
  takeValues = [16, 20, 24, 28, 32],
  className,
}: {
  total: number;
  take?: number;
  skip?: number;
  takeValues?: number[];
  className?: string;
}) {
  const [query, mergeQuery] = useRouteQuery();
  take = take ?? parseInt(query.take ?? "10");
  skip = skip ?? parseInt(query.skip ?? "0");
  const page = Math.floor(skip / take);
  const pageCount = Math.floor(total / take) + (total % take === 0 ? 0 : 1);
  const isHuge = pageCount > 15;

  const goTo = (toPage: number) => {
    mergeQuery({ skip: (toPage * take!).toString() });
  };
  const setTakeValue = (take: number) => {
    console.log({ take });
    mergeQuery({ take: take.toString() });
  };

  return (
    <div className={classNames("flex gap-1", className)}>
      <div className={"border border-purple-400 rounded " + (isHuge ? "inline-block" : "inline-block")}>
        {page !== 0 && (
          <button className="p-2 px-3 border-r border-purple-400" onClick={() => goTo(page - 1)}>
            Prev
          </button>
        )}
        {pageCount < 15 && <NormalPagination onPage={goTo} page={page} pageCount={pageCount} />}
        {pageCount >= 15 && <HugePagination onPage={goTo} page={page} pageCount={pageCount} />}
        {page !== pageCount - 1 && (
          <button className="p-2 px-3" onClick={() => goTo(page + 1)}>
            Next
          </button>
        )}
      </div>
      <div className="">
        <Select className="h-full" value={take} onChange={ev => setTakeValue(parseInt(ev.target.value))}>
          {/* add take value in the list, remove duplicates, sort list */}
          {[...new Set([...takeValues, take])].sort().map(takev => (
            <option value={takev} key={takev}>
              {takev}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

function NormalPagination({
  pageCount,
  page,
  onPage,
}: {
  pageCount: number;
  page: number;
  onPage: (page: number) => void;
}) {
  return (
    <>
      {Array(pageCount)
        .fill(0)
        .map((_, idx) => (
          <>
            <button
              className={"p-2 px-3 border-r border-purple-400 last:border-0" + (page === idx ? " bg-purple-100" : "")}
              onClick={() => onPage(idx)}
            >
              {idx + 1}
            </button>
          </>
        ))}
    </>
  );
}

function HugePagination({
  pageCount,
  page,
  onPage,
}: {
  pageCount: number;
  page: number;
  onPage: (page: number) => void;
}) {
  const PageButton = ({ pageIdx }: { pageIdx: number }) => (
    <>
      <button
        className={"p-2 px-3 border-r border-purple-400 last:border-0" + (page === pageIdx ? " bg-purple-100" : "")}
        onClick={() => onPage(pageIdx)}
      >
        {pageIdx + 1}
      </button>
    </>
  );

  const Dots = () => <div className="inline-block p-2 px-3 border-r border-purple-400">...</div>;

  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, idx) => idx)
        .map(pageIdx => (
          <PageButton pageIdx={pageIdx} key={pageIdx} />
        ))}
      <Dots />
      {page >= 3 && page <= pageCount - 4 && (
        <>
          {Array(5)
            .fill(0)
            .map((_, idx) => page - 2 + idx)
            .filter(p => p >= 3 && p <= pageCount - 4)
            .map(pageIdx => (
              <PageButton pageIdx={pageIdx} key={pageIdx} />
            ))}
          <Dots />
        </>
      )}
      {Array(3)
        .fill(0)
        .map((_, idx) => pageCount - 3 + idx)
        .map(pageIdx => (
          <PageButton pageIdx={pageIdx} key={pageIdx} />
        ))}
    </>
  );
}
