import * as React from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Spinner({ size = 24, ...props }: SpinnerProps) {
  return (
    <div
      {...props}
      style={{
        width: size,
        height: size,
        ...props.style,
      }}
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] ${props.className}`}
      role="status"
    >
      <span className="sr-only">로딩중...</span>
    </div>
  );
}
