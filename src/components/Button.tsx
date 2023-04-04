import { ButtonHTMLAttributes, HTMLProps, PropsWithChildren } from "react";

export default function Button({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      className={[
        "bg-slate-400 border border-black rounded px-2 py-1",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
