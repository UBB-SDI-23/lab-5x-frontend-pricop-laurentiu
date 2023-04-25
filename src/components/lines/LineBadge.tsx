import classNames from "classnames";
import { Line } from "../../lib/types";

export default function LineBadge({ line, className }: { line: Line | string; className?: string }) {
  return (
    <span
      className={classNames(
        "bg-black text-yellow-400 font-bold font-mono rounded whitespace-nowrap p-0.5 px-1",
        className
      )}
    >
      <i className="bi-arrow-up-right-square mr-1"></i>
      {typeof line === "string" ? line : line.name}
    </span>
  );
}
