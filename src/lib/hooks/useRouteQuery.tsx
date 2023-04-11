import { useSearchParams } from "react-router-dom";

export default function useRouteQuery(): [
  Record<string, string>,
  (params: Record<string, string>) => void
] {
  const [params, setParams] = useSearchParams();

  const data: Record<string, string> = {};
  const it = params.entries();
  while (true) {
    const itelem = it.next();
    if (itelem.done) break;
    const [k, v] = itelem.value;
    data[k] = v;
  }

  return [
    data,
    (newParams: Record<string, string>) => {
      setParams({ ...data, ...newParams });
    },
  ];
}
