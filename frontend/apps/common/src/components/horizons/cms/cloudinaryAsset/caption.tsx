import { Box, Typography } from "@mui/material";

type ImageCaptionProps = {
  captionText: string;
};

const ImageCaption = ({ captionText }: ImageCaptionProps) => {
  return (
    <Box component="figcaption">
      <Typography variant="small">{captionText}</Typography>
    </Box>
  );
};

export default ImageCaption;
