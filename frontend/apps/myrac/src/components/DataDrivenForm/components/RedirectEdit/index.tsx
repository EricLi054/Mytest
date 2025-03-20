"use client";

import type { UseFieldApiConfig } from "@data-driven-forms/react-form-renderer";
import { useMemo } from "react";
import { useFieldApi } from "@data-driven-forms/react-form-renderer";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid2 as Grid, Typography } from "@mui/material";
import { logFieldTouched } from "#utils/analyticsTagging";
import { z } from "zod";

import { useFormDataContext } from "../../FormDataProvider";
import { StyledEditButton } from "../styled";

const FieldSchema = z.object({
  label: z.string(),
  content: z.string(),
  link: z.string(),
});

export const RacwaRedirectEdit = (props: UseFieldApiConfig) => {
  const fieldProps = useFieldApi(props);
  const { label, content, link } = FieldSchema.parse(fieldProps);
  const { mustacheReplace } = useFormDataContext();

  const replacedContent = useMemo(() => {
    return mustacheReplace(content);
  }, [mustacheReplace, content]);

  return (
    <Grid container width="100%">
      <Grid container direction="column" size={{ xs: 9 }} gap={2}>
        <Grid>
          <Typography variant="h6">{label}</Typography>
        </Grid>
        <Grid>
          <Typography variant="h6" sx={{ fontWeight: "400" }}>
            {replacedContent}
          </Typography>
        </Grid>
      </Grid>
      <Grid container size={{ xs: 3 }} justifyContent="flex-end">
        <StyledEditButton
          type="button"
          href={link}
          onClick={() => {
            logFieldTouched(`Edit - ${label}`);
          }}
        >
          <FontAwesomeIcon size="xs" icon={faArrowUpRightFromSquare} style={{ paddingRight: "1rem" }} />
          Edit
        </StyledEditButton>
      </Grid>
    </Grid>
  );
};
