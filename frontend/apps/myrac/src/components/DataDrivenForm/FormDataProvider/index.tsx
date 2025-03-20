"use client";

// NOTE
// This is a temporary measure as we will be refactoring how the person data is injected into the forms in future
import type { PersonSchema } from "#graphql/person/queries/schema";
import type { PropsWithChildren } from "react";
import type { z } from "zod";
import { createContext, useContext } from "react";

export type FormDataContext = {
  mustacheReplace: (content: string) => string;
};

export const FormDataContext = createContext<FormDataContext | null>(null);

export const useFormDataContext = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormDataContext must be used within a FormDataProvider");
  }
  return context;
};

export type FormDataProviderProps = {
  person?: z.infer<typeof PersonSchema>;
  loginEmail: string;
} & PropsWithChildren;

export const FormDataProvider = ({ person, loginEmail, children }: FormDataProviderProps) => {
  // These are hard coded replaces as we will be replacing this functionality in future
  // So it doesn't need to cater for other cases than what we have
  const mustacheReplace = (content: string) => {
    return content
      .replace("{{loginEmail}}", loginEmail)
      .replace("{{person.Title}}", person?.title ?? "")
      .replace("{{person.FirstName}}", person?.firstName ?? "")
      .replace(
        "{{#if person.MiddleName}}{{person.MiddleName}} {{/if}}",
        person?.middleName ? `${person.middleName} ` : "",
      )
      .replace("{{person.Surname}}", person?.surname ?? "")
      .replace(
        "{{#if person.MobilePhone}}{{person.MobilePhone}}{{else}}Not Provided{{/if}}",
        person?.mobilePhone ?? "Not Provided",
      )
      .replace(
        "{{#if person.HomePhone}}{{person.HomePhone}}{{else}}Not Provided{{/if}}",
        person?.homePhone ?? "Not Provided",
      )
      .replace(
        "{{#if person.WorkPhone}}{{person.WorkPhone}}{{else}}Not Provided{{/if}}",
        person?.workPhone ?? "Not Provided",
      )
      .replace("{{person.PersonalEmailAddress}}", person?.personalEmailAddress ?? "")
      .replace(
        "{{#person.PostalAddress}}{{FormattedAddress}}{{/person.PostalAddress}}",
        person?.formattedAddress ?? "",
      );
  };
  return <FormDataContext.Provider value={{ mustacheReplace }}>{children}</FormDataContext.Provider>;
};
