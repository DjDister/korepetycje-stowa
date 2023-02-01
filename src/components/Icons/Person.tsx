import React from "react";

export default function Person({
  style,
  fill,
  stroke,
  height,
  width,
}: {
  style?: React.CSSProperties;
  fill?: string;
  stroke?: string;
  height?: string;
  width?: string;
}) {
  return (
    <svg
      width={width || "32"}
      height={height || "32"}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z"
        stroke="#49536E"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3.875 26.9999C5.10367 24.8713 6.87104 23.1037 8.99944 21.8747C11.1278 20.6458 13.5423 19.9988 16 19.9988C18.4577 19.9988 20.8722 20.6458 23.0006 21.8747C25.129 23.1037 26.8963 24.8713 28.125 26.9999"
        stroke="#49536E"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
