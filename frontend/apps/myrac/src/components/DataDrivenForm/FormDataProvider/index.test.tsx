import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormDataProvider, useFormDataContext } from ".";

const TestComponent = ({ contentToReplace }: { contentToReplace: string }) => {
  const { mustacheReplace } = useFormDataContext();
  return <p>{mustacheReplace(contentToReplace)}</p>;
};

const mockPerson: z.infer<typeof PersonSchema> = {
  title: "Mr",
  firstName: "John",
  surname: "Doe",
  cardColour: "Gold",
  racId: "123456",
  membershipCardNumber: "1231231231231231",
  membershipType: "Gold",
  tier: "Gold",
};

describe("Form Data Provider", () => {
  it("should give back content with no change", () => {
    render(
      <FormDataProvider person={mockPerson} loginEmail="test email">
        <TestComponent contentToReplace="Test content" />
      </FormDataProvider>,
    );

    expect(screen.getByText("Test content")).toBeVisible();
  });

  it("should replace login email", () => {
    render(
      <FormDataProvider person={mockPerson} loginEmail="test email">
        <TestComponent contentToReplace="Test content {{loginEmail}}" />
      </FormDataProvider>,
    );

    expect(screen.getByText("Test content test email")).toBeVisible();
  });

  it("should replace persons name", () => {
    render(
      <FormDataProvider person={mockPerson} loginEmail="test email">
        <TestComponent contentToReplace="{{person.Title}} {{person.FirstName}} {{#if person.MiddleName}}{{person.MiddleName}} {{/if}}{{person.Surname}}" />
      </FormDataProvider>,
    );

    expect(screen.getByText("Mr John Doe")).toBeVisible();
  });
});
