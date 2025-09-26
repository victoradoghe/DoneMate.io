import React from "react";

export function IonCheckmarkDoneCircleOutline(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="none"
        stroke="#46ae9c"
        strokeMiterlimit={10}
        strokeWidth={32}
        d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192Z"
      />
      <path
        fill="none"
        stroke="#46ae9c"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M368 192L256.13 320l-47.95-48m-16.23 48L144 272m161.71-80l-51.55 59"
      />
    </svg>
  );
}
