import React from "react";

export default function Warning({
  width,
  height,
}: {
  width?: string;
  height?: string;
}) {
  return (
    <svg
      width={`${width ?? "24px"}`}
      height={`${height ?? "24px"}`}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.7931 11.25L8.29934 1.74999C8.16782 1.52151 7.9784 1.33173 7.75017 1.19977C7.52194 1.0678 7.26297 0.998322 6.99934 0.998322C6.73571 0.998322 6.47673 1.0678 6.2485 1.19977C6.02028 1.33173 5.83086 1.52151 5.69934 1.74999L0.205589 11.25C0.0721313 11.4773 0.00120606 11.7359 1.52462e-05 11.9995C-0.00117557 12.2631 0.0674105 12.5223 0.198809 12.7508C0.330207 12.9794 0.519737 13.169 0.748154 13.3006C0.976571 13.4322 1.23574 13.501 1.49934 13.5H12.4993C12.7629 13.501 13.0221 13.4322 13.2505 13.3006C13.4789 13.169 13.6685 12.9794 13.7999 12.7508C13.9313 12.5223 13.9999 12.2631 13.9987 11.9995C13.9975 11.7359 13.9265 11.4773 13.7931 11.25ZM6.49934 5.99999C6.49934 5.86738 6.55202 5.7402 6.64579 5.64644C6.73955 5.55267 6.86673 5.49999 6.99934 5.49999C7.13195 5.49999 7.25912 5.55267 7.35289 5.64644C7.44666 5.7402 7.49934 5.86738 7.49934 5.99999V8.49999C7.49934 8.6326 7.44666 8.75978 7.35289 8.85354C7.25912 8.94731 7.13195 8.99999 6.99934 8.99999C6.86673 8.99999 6.73955 8.94731 6.64579 8.85354C6.55202 8.75978 6.49934 8.6326 6.49934 8.49999V5.99999ZM6.99934 11.5C6.851 11.5 6.706 11.456 6.58266 11.3736C6.45932 11.2912 6.36319 11.174 6.30643 11.037C6.24966 10.9 6.23481 10.7492 6.26375 10.6037C6.29269 10.4582 6.36412 10.3245 6.46901 10.2197C6.5739 10.1148 6.70753 10.0433 6.85302 10.0144C6.99851 9.98546 7.14931 10.0003 7.28635 10.0571C7.4234 10.1138 7.54053 10.21 7.62294 10.3333C7.70535 10.4566 7.74934 10.6017 7.74934 10.75C7.74934 10.9489 7.67032 11.1397 7.52967 11.2803C7.38902 11.421 7.19825 11.5 6.99934 11.5Z"
        fill="#FFAD0D"
      />
    </svg>
  );
}