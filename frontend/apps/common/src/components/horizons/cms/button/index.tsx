import type { ButtonProps, ContentfulButton } from "#types/horizons/button";
import type { ComponentProps } from "#types/horizons/componentProps";
import NextLink from "next/link";
import { Button as MuiButton } from "@mui/material";

import { getButton } from "./data";

const fetchButton = async (id: string) => {
  try {
    const data = await getButton(id);
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

async function Button(props: ComponentProps) {
  const { data } = props;
  const buttonContentfulEntry: ContentfulButton = (await fetchButton(data.sys.id)) as ContentfulButton;

  if (!buttonContentfulEntry) {
    return <></>;
  }

  const button: ButtonProps = buttonContentfulEntry.data.horizons_button;

  return (
    <MuiButton LinkComponent={NextLink} variant={button.variant} color={button.colour} href={button.link}>
      {button.text}
    </MuiButton>
  );
}

export default Button;
