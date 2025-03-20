import type { Meta, StoryObj } from "@storybook/react";
import { useActionState, useState } from "react";
import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button, Divider, Typography } from "@mui/material";
import { z } from "zod";

import type { TooltipProps } from "@racwa/react-components";
import { CarCollisionMulti, PetGRFX206 } from "@racwa/react-components";

import type { SelectionGroupProps } from ".";
import SelectionGroup from ".";

const meta = {
  title: "motoring/Components/SelectionGroup",
  component: Template,
  render: Template,
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

const selectionValue = z.enum(["🐒", "🚘🚗", "🐕🐈", "🍌", "🦍", "🦧"]);

type StoryProps = Omit<SelectionGroupProps, "children" | "id" | "name" | "onChange"> & {
  defaultValue?: string | string[];
};

function Template({ exclusive, optional, defaultValue, ...props }: StoryProps) {
  const schema = z.object({
    selection: exclusive
      ? optional
        ? selectionValue.optional()
        : selectionValue
      : optional
        ? z.array(selectionValue).optional()
        : z.array(selectionValue).nonempty(),
  });

  const action = (_: unknown, formData: FormData) => {
    const submission = parseWithZod(formData, { schema });

    const status = `action (status: ${submission.status})`;
    if (submission.status !== "success") {
      console.log(status, submission.payload, submission.error);
    } else {
      console.log(status, submission.value.selection);
    }

    return submission.reply();
  };

  const [lastResult, formAction] = useActionState(action, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate: ({ formData }) => {
      const submission = parseWithZod(formData, { schema });

      if (submission.status === "error") {
        const errors = submission.error ? Object.values(submission.error).flatMap((err) => err) : "No errors";
        console.log(`onValidate (status: ${submission.status})`, errors);
      }

      return submission;
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    defaultValue: { selection: defaultValue },
  });

  const [openTooltip, setOpenTooltip] = useState(false);
  const tooltipProps = {
    title: "Compound components are cool",
    message: "🤯",
    open: openTooltip,
    onClick: () => setOpenTooltip(!openTooltip),
    onClickClose: () => setOpenTooltip(false),
    onClickAway: () => setOpenTooltip(false),
  } as const satisfies TooltipProps;

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)} action={formAction}>
        <SelectionGroup
          name={fields.selection.name}
          label="Selection Group"
          sublabel="With all selector items"
          tooltipProps={tooltipProps}
          exclusive={exclusive}
          optional={optional}
          {...props}
        >
          <SelectionGroup.Column>
            <Typography variant="h2">Card Items</Typography>
            <SelectionGroup.SelectionCard value="🐒" title="Selection Card" sx={{ flex: 1 }}>
              <span style={{ fontSize: 28 }}>🐒</span>
            </SelectionGroup.SelectionCard>
            <SelectionGroup.ListCard
              value="🚘🚗"
              label="List Card"
              sublabel="Lanscape variant"
              icon={<CarCollisionMulti />}
            />
            <SelectionGroup.ListCard
              value="🐕🐈"
              label="List Card"
              sublabel="Portrait variant"
              icon={<PetGRFX206 />}
              variant="portrait"
            />
            <Divider sx={{ marginBottom: ({ spacing }) => spacing(2) }} />

            <Typography variant="h2">Checkbox Items</Typography>
            <SelectionGroup.CheckboxListItem value="🍌" label="Checkbox List Item" sublabel="🍌" />
            <Divider sx={{ marginBottom: ({ spacing }) => spacing(2) }} />

            <Typography variant="h2">Radio Items</Typography>
            <SelectionGroup.RadioItem value="🦍" label="Radio Item" icon={<>🦍</>} />
            <SelectionGroup.RadioListItem value="🦧" label="Radio List Item" sublabel="🦧" />
          </SelectionGroup.Column>
        </SelectionGroup>
        <Button
          sx={{ marginTop: ({ spacing }) => spacing(5) }}
          type="submit"
          color="primary"
          variant="contained"
          fullWidth
        >
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}

export const Default = {} satisfies Story;

export const WithDefaultValue = {
  args: {
    defaultValue: ["🐒", "🍌"],
  },
} satisfies Story;

export const Exclusive = {
  args: {
    exclusive: true,
  },
} satisfies Story;

export const Optional = {
  args: {
    optional: true,
    optionalText: "optional",
  },
} satisfies Story;

export const ExclusiveDefaultValue = {
  args: {
    ...Exclusive.args,
    defaultValue: "🐕🐈",
  },
} satisfies Story;

export const ExclusiveAndOptional = {
  args: {
    exclusive: true,
    optional: true,
  },
} satisfies Story;

export const Disabled = {
  args: {
    disabled: true,
  },
} satisfies Story;

export const DisabledWithDefaultValue = {
  args: {
    disabled: true,
    defaultValue: WithDefaultValue.args.defaultValue,
  },
} satisfies Story;
