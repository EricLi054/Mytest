"use client";

import { useRouter } from "next/navigation";

import { FooterSearchBar as DSSearchBar } from "@racwa/react-components";

export default function FooterSearchBar({ placeholderText }: { placeholderText: string }) {
  const router = useRouter();
  return (
    <DSSearchBar
      placeHolder={placeholderText}
      onSubmit={(event) => {
        event.preventDefault();
        const input = document.getElementById("search") as HTMLInputElement;
        if (input.value) {
          router.push(`/search#/searchresult?query=${input.value}`);
        }
      }}
    />
  );
}
