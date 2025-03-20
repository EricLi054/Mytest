import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";

export const getEditContactDetailsFormStep2Schema = (person: z.infer<typeof PersonSchema>, b2cUrl: string) => {
  return [
    {
      name: "mobilePhone",
      component: "text-field",
      label: "Mobile",
      helperText: null,
      tooltipTitle: null,
      tooltipText: null,
      required: false,
      placeholder: "e.g. 0400 123 456",
      validate: [
        {
          type: "generic-phone",
          message: "Please enter a valid mobile number",
          phoneType: "Mobile",
        },
      ],
      initialValue: person.mobilePhone,
      initializeOnMount: true,
    },
    {
      name: "homePhone",
      component: "text-field",
      label: "Home phone",
      helperText: null,
      tooltipTitle: null,
      tooltipText: null,
      required: false,
      placeholder: "e.g. 08 1234 5678",
      validate: [
        {
          type: "generic-phone",
          message: "Please enter a valid landline including your area code",
          phoneType: "Landline",
        },
      ],
      initialValue: person.homePhone,
      initializeOnMount: true,
    },
    {
      name: "workPhone",
      component: "text-field",
      label: "Work phone",
      helperText: null,
      tooltipTitle: null,
      tooltipText: null,
      required: false,
      placeholder: "e.g. 0400 123 456 or 08 1234 5678",
      validate: [
        {
          type: "generic-phone",
          message: "Please enter a valid mobile number or a valid landline including your area code",
          phoneType: "Both",
        },
      ],
      initialValue: person.workPhone,
      initializeOnMount: true,
    },
    {
      name: "personalEmailAddress",
      component: "text-field",
      label: "Contact email",
      helperText: "This is the email we will use to contact you. It may be different from your log-in email.",
      tooltipTitle: null,
      tooltipText: null,
      required: false,
      placeholder: "e.g. example@email.com",
      validate: [
        { type: "no-removal", message: "Please enter a valid email" },
        { type: "email", message: "Please enter a valid email" },
      ],
      initialValue: person.personalEmailAddress,
      initializeOnMount: true,
    },
    {
      name: "postalAddress",
      component: "address-input",
      label: "Mailing address",
      tooltipTitle: "Mailing address",
      tooltipText:
        "This is the address where you'd like your mail sent. Changing your address here won't automatically update your address in each of your insurance policies. But if you do update your address, we'll give you a link so you can update it in your policies.",
      required: true,
      placeholder: "e.g. 832 Wellington Street, PERTH WA",
      validate: [
        {
          type: "required",
          message: "Please select a valid mailing address",
        },
        {
          type: "address-validation",
          message: "Your address can't be validated at this time. Please try again later.",
        },
      ],
      initialValue: person.formattedAddress,
      initializeOnMount: true,
      apiErrorMessage: "We are unable to search for addresses at the moment. Please try again later.",
      notFoundMessage: "We can't find your address. Please call us on 13 17 03 to update your Mailing Address.",
      refineFurtherMessage: "Enter more information to narrow down your search.",
    },
    {
      name: "submit",
      component: "wizard-submit-button",
      label: "Update contacts",
      helperText: null,
      tooltipTitle: null,
      tooltipText: null,
      required: false,
      placeholder: null,
      validate: [],
      successText: {
        json: {
          nodeType: "document",
          data: {},
          content: [
            {
              nodeType: "paragraph",
              data: {},
              content: [
                {
                  nodeType: "text",
                  value:
                    "If you've moved house, you must update your address in each of the RAC insurance policies related to that address. You can do this in ",
                  marks: [],
                  data: {},
                },
                {
                  nodeType: "hyperlink",
                  data: {
                    uri: `${b2cUrl}/Secure/PCM`,
                  },
                  content: [
                    {
                      nodeType: "text",
                      value: "My policies",
                      marks: [],
                      data: {},
                    },
                  ],
                },
                { nodeType: "text", value: ".", marks: [], data: {} },
              ],
            },
          ],
        },
      },
      errorText: {
        json: {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  marks: [],
                  value: "Please try again later or call ",
                  nodeType: "text",
                },
                {
                  data: { uri: "tel:131703" },
                  content: [
                    {
                      data: {},
                      marks: [],
                      value: "13 17 03",
                      nodeType: "text",
                    },
                  ],
                  nodeType: "hyperlink",
                },
                { data: {}, marks: [], value: ".", nodeType: "text" },
              ],
              nodeType: "paragraph",
            },
          ],
          nodeType: "document",
        },
      },
      initialValue: null,
      initializeOnMount: true,
      errorTitle: "Sorry, we are unable to update your details.",
      successTitle: "You've updated your contact details but...",
      errorButtonText: "Okay",
      successButtonText: "Okay",
    },
    {
      name: "cancel",
      component: "wizard-cancel-button",
      label: "Cancel",
      helperText: null,
      tooltipTitle: null,
      tooltipText: null,
      required: false,
      placeholder: null,
      validate: [],
      initialValue: null,
      initializeOnMount: true,
      modalTitle: "Are you sure you want to cancel?",
      confirmText: "Yes, please cancel",
      cancelText: "No, go back",
    },
  ];
};
