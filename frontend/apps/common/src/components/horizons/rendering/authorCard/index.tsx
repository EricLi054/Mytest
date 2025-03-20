import type { Author } from "#types/horizons/author";
import type { ReactNode } from "react";
import { Avatar, Box, Container, Typography } from "@mui/material";

import { styles } from "./styles";

type AuthorCardProps = {
  author: Author;
  authorBio: ReactNode;
};

const AuthorCard = ({ author, authorBio }: AuthorCardProps) => {
  return (
    <Box component="section" sx={styles.authorCardWrapper}>
      <Container maxWidth="lg">
        <Box sx={styles.authorCardDesktop}>
          <Box sx={styles.authorCardDesktopAvatarWrapper}>
            <Avatar
              alt={author.name}
              src={author.profilePicture[0]?.secure_url}
              sx={styles.authorCardDesktopAvatarImage}
              role="img"
            />
          </Box>
          <Box maxWidth={600}>
            <Typography component="p" variant="overline" color="primary.dark">
              Author
            </Typography>
            <Typography variant="h1" component="h1" mt={0} mb={2}>
              {author.name}
            </Typography>
            {authorBio}
          </Box>
        </Box>
        <Box sx={styles.authorCardMobile}>
          <Avatar
            alt={author.name}
            src={author.profilePicture[0]?.secure_url}
            sx={styles.authorCardMobileAvatarImage}
            role="img"
          />
          <Box>
            <Typography component="p" variant="overline" color="primary.dark">
              Author
            </Typography>
            <Typography variant="h1" component="h1" my={0}>
              {author.name}
            </Typography>
          </Box>
        </Box>
        <Box sx={styles.authorCardMobileBioWrapper}>{authorBio}</Box>
      </Container>
    </Box>
  );
};

export default AuthorCard;
