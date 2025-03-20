import type { ContentfulLinkSchema } from "#graphql/sharedSchema/linkSchema";
import type { JSX } from "react";
import type { z } from "zod";
import Link from "next/link";
import { Typography } from "@mui/material";

export const createBreadcrumbs = (title: string, breadcrumbs?: z.infer<z.ZodArray<typeof ContentfulLinkSchema>>) => {
  const breadcrumbArray: JSX.Element[] = [];

  if (breadcrumbs !== undefined && breadcrumbs.length > 0) {
    breadcrumbArray.push(
      ...breadcrumbs.map((item) => {
        return (
          <Typography key={item.longLinkText}>
            {item.linkUrl ? <Link href={item.linkUrl}>{item.longLinkText}</Link> : item.longLinkText}
          </Typography>
        );
      }),
    );
  }

  breadcrumbArray.push(<Typography key={title}>{title}</Typography>);

  return breadcrumbArray;
};
