import { serverEnv } from "#env/server";
import { graphql } from "gql.tada";

import { execute } from "@racwa/gql";

import { ContentfulDataDrivenFormSchema } from "./schema";
import { generateSchema } from "./util";

const query = graphql(`
  query GetFormData($id: String!, $preview: Boolean) {
    rac_dataDrivenForm(id: $id, preview: $preview) {
      title
      pages: pagesCollection {
        items {
          name
          requiresMfaToProceed
          fields: fieldsCollection {
            items {
              name
              component
              required
              requiredMessage
              label
              richText {
                json
              }
              fixedLabelWidth
              helperText
              placeholder
              tooltipTitle
              tooltipText
              selectOptions
              initialValue
              successText {
                json
              }
              errorText {
                json
              }
              validators: validatorsCollection {
                items {
                  validatorType
                  message
                  pattern
                  nameType
                  phoneType
                  minAge
                  maxAge
                  ageOutOfRangeMessage
                }
              }
              conditionalLogic
              extraData
            }
          }
          nextStep {
            name
          }
        }
      }
    }
  }
`);

export const getDataDrivenFormData = async (id: string) => {
  try {
    const rawData = await execute({
      endpoint: serverEnv().GRAPHQL_ENDPOINT,
      query,
      sourceSystem: "myRAC",
      variables: { id, preview: serverEnv().CONTENTFUL_PREVIEW },
    });

    const validatedRawData = ContentfulDataDrivenFormSchema.parse(rawData.data.rac_dataDrivenForm);
    return generateSchema(validatedRawData);
  } catch (error) {
    console.error("getDataDrivenFormData: failed to fetch data driven form data for id:", id, error);
    throw error;
  }
};
