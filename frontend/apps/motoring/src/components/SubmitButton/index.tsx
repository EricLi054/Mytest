import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { useFormStatus } from "react-dom";

export default function SubmitButton({ children, ...props }: ButtonProps) {
  const status = useFormStatus();

  return (
    <Button
      type="submit"
      color="primary"
      variant="contained"
      fullWidth
      disabled={props.disabled ?? status.pending}
      sx={{ marginTop: 2 }}
      {...props}
    >
      {children}
    </Button>
  );
}
