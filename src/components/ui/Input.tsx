import classNames from "classnames";
import { HTMLProps } from "react";

export default function Input({
  className,
  disabled,
  ...props
}: { className?: string } & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return (
    <input
      className={classNames(
        "p-1 px-2 border rounded ",
        {
          "border-purple-400 hover:border-purple-600 focus:border-purple-900": !disabled,
          "text-gray-400": disabled,
        },
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
}
