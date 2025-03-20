import { Box, Link } from "@mui/material";

import { colors } from "@racwa/styles";

export type CancelLinkProps = {
  onClick?: () => void;
};

export const CancelLink = ({ onClick: customOnClick }: CancelLinkProps) => {
  return (
    <Box display="flex" justifyContent="center" width="100%">
      <Link
        style={{ fontSize: "14px", fontWeight: "400", color: colors.linkBlue, cursor: "pointer" }}
        href={process.env.NEXT_PUBLIC_RAC_HOMEPAGE_URL}
        aria-label="Cancel and return to the RAC homepage"
        onClick={customOnClick}
      >
        Cancel
      </Link>
    </Box>
  );
};

export default CancelLink;
