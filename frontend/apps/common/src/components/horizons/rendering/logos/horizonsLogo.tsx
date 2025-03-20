import NextLink from "next/link";
import { Link } from "@mui/material";

import { CldImage } from "@racwa/ui";

type ImageProps = {
  width: number;
  height: number;
};

export const HorizonsLogo = ({ width, height }: ImageProps) => {
  return (
    <Link component={NextLink} href="/horizons" className="navigation-menu-link" pt={{ xs: 0, md: 2 }}>
      <CldImage
        environmentPath="/rac-horizons"
        src="https://res.rac.com.au/rac-horizons/image/upload/v1742192981/horizons_logo_xttcmc.svg"
        alt="Horizons Logo"
        title="Horizons Logo"
        width={width}
        height={height}
        quality="auto:best"
      />
    </Link>
  );
};
