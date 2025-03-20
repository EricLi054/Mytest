export const optimiseCloudinaryImage = (imageUrl: string): string => {
  let updatedUrl = imageUrl;

  if (!updatedUrl.includes("f_auto")) {
    updatedUrl = updatedUrl.replace("/image/upload/", "/image/upload/f_auto/");
  }

  if (!updatedUrl.includes("q_auto:eco")) {
    if (updatedUrl.includes("q_auto")) {
      updatedUrl = updatedUrl.replace(/q_auto[^,/]*/g, "q_auto:eco");
    } else {
      updatedUrl = updatedUrl.replace("/image/upload/f_auto/", "/image/upload/f_auto/q_auto:eco/");
    }
  }

  return updatedUrl;
};
