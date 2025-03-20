import NextLink from "next/link";
import { Link } from "@mui/material";

import { CldImage } from "@racwa/ui";

type ImageProps = {
  width: number;
  height: number;
};

export const RACLogo = ({ width, height }: ImageProps) => {
  return (
    <Link component={NextLink} href="/" className="navigation-menu-link" height={46} display="flex" alignItems="center">
      <CldImage
        environmentPath="/rac-horizons"
        src="https://res.rac.com.au/rac-horizons/image/upload/v1742192981/rac_logo_ujebgm.svg"
        alt="RAC Logo"
        title="RAC Logo"
        width={width}
        height={height}
        quality="auto:low"
      />
    </Link>
  );
};
