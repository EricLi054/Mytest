import type { ButtonProps } from "@mui/material";
import Link from "next/link";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { RacwaChevronButton } from "@racwa/react-components";
import { colors } from "@racwa/styles";

type BackButtonProps = ButtonProps & { href?: string };

export default function BackButton({ href, ...props }: BackButtonProps) {
  const back = <span style={{ textDecoration: "underline", fontSize: "18px" }}>Back</span>;

  return (
    <RacwaChevronButton
      {...props}
      variant="text"
      title="Back"
      sx={{ color: colors.linkBlue, marginTop: "24px" }}
      startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
      size="small"
      endIcon={null}
      fullWidth
      href={href ?? "#"}
      LinkComponent={Link}
      rel="noopener noreferrer"
    >
      {back}
    </RacwaChevronButton>
  );
}
