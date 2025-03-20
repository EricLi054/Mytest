import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import type { ListCardSelectorProps } from "@racwa/react-components";

import type { SelectionGroupProps } from ".";
import SelectionGroup from ".";

const mockOnChangeMulti = vi.fn<(value: string[]) => void>();
const mockOnChangeExclusive = vi.fn<(value: string) => void>();
const mockOnSubmit = vi.fn<(formValue: unknown) => void>();

const defaultProps = {
  label: "Select an option",
  sublabel: "...please",
  tooltipProps: {
    title: "You should really pick something",
    message: "or else...",
  },
} as const satisfies TestFormProps;

const selectionValue = z.enum(["🐒", "🦍", "🦧"]);

const selectionItems = [
  { value: "🐒", label: "Monkey" },
  { value: "🦍", label: "Gorilla" },
  { value: "🦧", label: "Orangutan" },
] as const satisfies Omit<ListCardSelectorProps, "icon">[];

type TestFormProps = Partial<Omit<SelectionGroupProps, "onChange">>;

const TestForm = ({ defaultValue, ...props }: TestFormProps & { defaultValue?: string[] }) => {
  const schema = z.object({
    selection: props.exclusive
      ? props.optional
        ? selectionValue.optional()
        : selectionValue
      : props.optional
        ? z.array(selectionValue).optional()
        : z.array(selectionValue).nonempty(),
  });

  const [form, fields] = useForm({
    onValidate: ({ formData }) => parseWithZod(formData, { schema }),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: { selection: defaultValue },
  });

  const items = selectionItems.map((item) => <SelectionGroup.ListCard key={item.value} {...item} icon={<></>} />);

  const exclusiveGroup = (
    <SelectionGroup
      name={fields.selection.name}
      {...defaultProps}
      {...props}
      exclusive
      onChange={mockOnChangeExclusive}
    >
      {items}
    </SelectionGroup>
  );

  const multichoiceGroup = (
    <SelectionGroup
      name={fields.selection.name}
      {...defaultProps}
      {...props}
      exclusive={false}
      onChange={mockOnChangeMulti}
    >
      {items}
    </SelectionGroup>
  );

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)}>
        {props.exclusive ? exclusiveGroup : multichoiceGroup}
        <button onClick={() => mockOnSubmit(form.value)}>Submit</button>
      </form>
    </FormProvider>
  );
};

const helperText = "Please select an option";
const submitButton = () => screen.getByRole("button", { name: "Submit" });

describe("SelectionGroup", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should be able to render", () => {
    render(<TestForm />);

    expect(screen.getByText(defaultProps.label)).toBeVisible();
    expect(screen.getByText(defaultProps.sublabel)).toBeVisible();

    selectionItems.forEach((item) => expect(screen.getByText(item.label)).toBeVisible());
  });

  it("should show helper text when not optional and no seletion is made", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    await user.click(submitButton());

    expect(screen.getByText(helperText)).toBeVisible();
  });

  it("should show optional text and be valid when optional is true", async () => {
    const user = userEvent.setup();
    render(<TestForm optional />);

    await user.click(submitButton());

    expect(screen.getByText("(optional)")).toBeVisible();
    expect(screen.queryByText(helperText)).not.toBeInTheDocument();
    expect(mockOnSubmit).toHaveBeenCalledWith(undefined);
  });

  it("should be disabled when disabled is true", async () => {
    const user = userEvent.setup();
    render(<TestForm disabled />);

    for (const item of selectionItems) {
      await user.click(screen.getByText(item.label));
    }
    await user.click(submitButton());

    expect(mockOnSubmit).toHaveBeenCalledWith(undefined);
  });

  it("should allow multiple selections when not exclusive", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    for (const item of selectionItems) {
      await user.click(screen.getByText(item.label));
    }
    await user.click(submitButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ selection: selectionItems.map((s) => s.value) });
    });
  });

  it("should only allow one selection when exclusive", async () => {
    const user = userEvent.setup();
    render(<TestForm exclusive />);

    for (const item of selectionItems) {
      await user.click(screen.getByText(item.label));
    }
    await user.click(submitButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({ selection: selectionItems[selectionItems.length - 1]?.value });
    });
  });

  it("should call onChange with an array of string values when selection is changed and group is not exclusive", async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    for (const item of selectionItems) {
      await user.click(screen.getByText(item.label));
    }
    const values = selectionItems.map((s) => s.value);

    await waitFor(() => {
      expect(mockOnChangeMulti).toHaveBeenCalledTimes(selectionItems.length);
    });

    expect(mockOnChangeMulti).toHaveBeenNthCalledWith(1, [values[0]]);
    expect(mockOnChangeMulti).toHaveBeenNthCalledWith(2, values.slice(0, 2));
    expect(mockOnChangeMulti).toHaveBeenLastCalledWith(values);
  });

  it("should call onChange with string value when selection is changed and group is exclusive", async () => {
    const user = userEvent.setup();
    render(<TestForm exclusive />);

    for (const item of selectionItems) {
      await user.click(screen.getByText(item.label));
    }
    const values = selectionItems.map((s) => s.value);

    await waitFor(() => {
      expect(mockOnChangeExclusive).toHaveBeenCalledTimes(selectionItems.length);
    });
    values.forEach((value, index) => {
      expect(mockOnChangeExclusive).toHaveBeenNthCalledWith(index + 1, value);
    });
  });
});
