"use client";

import { useFormStatus } from "react-dom";

import type { RacwaBackdropProps } from "@racwa/react-components";
import { RacwaLoadingModal } from "@racwa/react-components";

export default function FormLoadingModal(props: Partial<RacwaBackdropProps>) {
  const { pending } = useFormStatus();

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  return <RacwaLoadingModal {...props} open={props.open || pending} />;
}
