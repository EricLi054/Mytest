import type { Meta, StoryObj } from "@storybook/react";
import { useActionState } from "react";
import { FormProvider, getFormProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Button } from "@mui/material";
import { z } from "zod";

import type { ToggleButtonGroupProps } from ".";
import { ToggleButtonGroup } from ".";

const meta = {
  title: "ui/Components/ToggleButtonGroup",
  tags: ["@racwa/ui"],
  component: Template,
  render: Template,
} satisfies Meta<typeof Template>;

export default meta;
type Story = StoryObj<typeof meta>;

type StoryProps = Omit<Partial<ToggleButtonGroupProps>, "name" | "options"> & {
  defaultValue?: z.infer<typeof schema>["option"];
};

const toggleOptions = ["Yes", "No"] as const;

const schema = z.object({
  option: z.enum(toggleOptions),
});

const action = (_: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema });

  const status = `action (status: ${submission.status})`;
  if (submission.status !== "success") {
    console.log(status, submission.payload, submission.error);
  } else {
    console.log(status, submission.value.option);
  }

  return submission.reply();
};

function Template({ defaultValue, ...props }: StoryProps) {
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
    defaultValue: { option: defaultValue },
  });

  return (
    <FormProvider context={form.context}>
      <form {...getFormProps(form)} action={formAction}>
        <ToggleButtonGroup
          name={fields.option.name}
          label="Do you like NextJs?"
          sublabel="Answer honestly..."
          helperText="Don't sit on the fence!"
          options={[...toggleOptions]}
          {...props}
        />
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
    defaultValue: "No",
  },
} satisfies Story;

export const WithTooltip = {
  args: {
    tooltipProps: {
      title: "Tooltip title",
      message: "Tooltip message",
    },
  },
} satisfies Story;
