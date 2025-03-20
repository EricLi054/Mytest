"use client";

import ClearSession from "#components/ClearSession";
import { RootContainer } from "#components/RootContainer";

import { createSessionAction } from "./actions";
import RegisterForm from "./Form";

export default function RegisterPage() {
  return (
    <RootContainer>
      <ClearSession />
      <RegisterForm formAction={createSessionAction} />
    </RootContainer>
  );
}
