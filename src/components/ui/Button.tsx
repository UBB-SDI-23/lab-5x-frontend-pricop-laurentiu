import classNames from "classnames";
import { HTMLProps, Ref, forwardRef } from "react";

const Button = forwardRef(
  (
    {
      className,
      children,
      ...props
    }: { className?: string } & React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    ref: Ref<HTMLButtonElement>
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "p-1 px-2 border rounded bg-purple-300 border-purple-700 hover:bg-purple-400 hover:border-purple-600 active:bg-purple-800 focus:border-purple-900",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default Button;
