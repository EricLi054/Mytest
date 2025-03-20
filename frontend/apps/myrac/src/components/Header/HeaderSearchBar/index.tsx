"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { StyledInputAdornment, StyledOutlinedInput, StyledSearchButton } from "./styled";

export default function HeaderSearchBar({
  placeholder,
  fullWidth = false,
}: {
  placeholder: string;
  fullWidth?: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const onSearch = () => {
    if (searchTerm) {
      router.push(`/search#/searchresult?query=${searchTerm}`);
    }
  };

  return (
    <StyledOutlinedInput
      placeholder={placeholder}
      onChange={(e) => {
        setSearchTerm(e.target.value);
      }}
      endAdornment={
        <StyledInputAdornment position="end">
          <StyledSearchButton onClick={onSearch}>
            <FontAwesomeIcon icon="search" />
          </StyledSearchButton>
        </StyledInputAdornment>
      }
      fullWidth={fullWidth}
    />
  );
}
