import { headers } from "next/headers";

const CONTENT_PREVIEW_HEADER = "Preview_Content";

export const getContentfulPreviewHeader = async () => {
  const headersList = await headers();
  return headersList.get(CONTENT_PREVIEW_HEADER) == "true";
};
