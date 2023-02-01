import React from "react";

export default function Eye({
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
        d="M16 7C6 7 2 16 2 16C2 16 6 25 16 25C26 25 30 16 30 16C30 16 26 7 16 7Z"
        stroke="#49536E"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21Z"
        stroke="#49536E"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
