"use server";

import { CldImage } from "@racwa/ui";

import type { ComponentSwitchableProps } from "../types";
import { geMustacheImageData } from "./data";

const MustacheImage: React.FC<ComponentSwitchableProps> = async ({ id }) => {
  const data = await geMustacheImageData(id);
  if (!data) {
    console.error("Error: MustacheImage.tsx no imageIdTemplate for:", id);
    return null;
  }

  return (
    <CldImage
      format="svg"
      fill
      id={id}
      src={data.imageIdTemplate}
      alt={data.altTemplate ?? ""}
      style={{ borderRadius: data.borderRadius ?? 3 }}
    />
  );
};

export default MustacheImage;
