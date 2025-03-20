import type { Author, ContentfulAuthorCollectionData } from "#types/horizons/author";
import NextLink from "next/link";
import { Avatar, Box, Card, CardContent, Container, Grid2, Link, Typography } from "@mui/material";
import ServerError from "#components/horizons/rendering/serverError";
import { optimiseCloudinaryImage } from "#utils/horizons/optimiseCloudinaryImage";

import { getAuthorsData } from "./data";

const fetchAuthorsData = async () => {
  try {
    const data = await getAuthorsData();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default async function HorizonsAuthorsPage() {
  const contentfulData: ContentfulAuthorCollectionData = (await fetchAuthorsData()) as ContentfulAuthorCollectionData;

  if (!contentfulData) {
    return <ServerError />;
  }

  const authors = contentfulData.data.horizons_authorCollection.items;

  return (
    <Box sx={{ backgroundColor: "#F3F3F3" }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h1" align="center" pb={4}>
          Authors
        </Typography>
        <Grid2 container spacing={4}>
          {authors.map((author: Author) => (
            <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={author.slug}>
              <Link component={NextLink} href={`/horizons/authors/${author.slug}`} underline="none">
                <Card
                  elevation={3}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    pt: 4,
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Avatar
                    src={optimiseCloudinaryImage(author.profilePicture[0]?.secure_url ?? "")}
                    alt={author.name}
                    sx={{
                      width: 120,
                      height: 120,
                      border: "2px solid",
                      borderColor: "primary.main",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {author.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid2>
          ))}
        </Grid2>
      </Container>
    </Box>
  );
}
