"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Link, List, ListItem, Typography } from "@mui/material";

import { horizonsTypography } from "@racwa/styles";

type Heading = {
  text: string;
  id: string;
};

const ArticleSummary = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const articleHeadings = Array.from(document.querySelectorAll("h2"))
      .filter((h2) => !h2.closest("aside"))
      .map((heading, index) => {
        const id = heading.textContent?.trim().replace(/\s+/g, "-").toLowerCase() ?? `heading-${index}`;

        heading.setAttribute("id", id);

        return {
          text: heading.textContent ?? "",
          id,
        };
      });

    setHeadings(articleHeadings);
  }, []);
  return (
    <nav aria-label="Table of Contents" style={{ padding: "0 0 24px 0" }}>
      <Typography
        variant="h3"
        gutterBottom
        color="text.primary"
        marginTop={0}
        marginBottom={3}
        fontFamily={horizonsTypography.bodyArticle.fontFamily}
      >
        <b>Summary</b>
      </Typography>
      <List sx={{ padding: 0 }}>
        {headings.map((heading) => (
          <ListItem
            key={heading.id}
            sx={{
              padding: 0,
              marginBottom: 3,
              position: "relative",
              display: "flex",
              alignItems: "center",
              paddingLeft: "1.5rem",
              "&::before": {
                content: '""',
                position: "absolute",
                left: 0,
                width: "12px",
                height: "12px",
                border: "2px solid",
                borderColor: "primary.dark",
                backgroundColor: "white",
                borderRadius: "50%",
              },
            }}
          >
            <Link
              component={NextLink}
              href={`#${heading.id}`}
              underline="none"
              className="summary-anchor-link"
              sx={{
                fontSize: "20px",
                color: "primary.dark",
                pl: 2,
                fontFamily: horizonsTypography.bodyArticle.fontFamily,
                "&:hover": { color: "primary.dark" },
              }}
            >
              <b>{heading.text}</b>
            </Link>
          </ListItem>
        ))}
      </List>
    </nav>
  );
};

export default ArticleSummary;
