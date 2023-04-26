import classNames from "classnames";
import { HTMLProps } from "react";

export default function Select({
  className,
  children,
  ...props
}: { className?: string } & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
  return (
    <select
      className={classNames(
        "p-1 px-2 border rounded border-purple-400 hover:border-purple-600 focus:border-purple-900",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
