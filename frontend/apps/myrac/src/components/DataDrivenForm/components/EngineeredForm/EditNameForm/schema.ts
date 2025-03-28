import type { PersonSchema } from "#graphql/person/queries/schema";
import type { z } from "zod";

export const getEditNameFormStep2Schema = (person: z.infer<typeof PersonSchema>) => {
  return [
    {
      name: "info",
      component: "info-alert",
      helperText: "As written on your driver's licence or passport.",
      validate: [],
      richText: {
        json: {
          data: {},
          content: [
            {
              data: {},
              content: [
                {
                  data: {},
                  marks: [
                    {
                      type: "bold",
                    },
                  ],
                  value: "Please use your legal name",
                  nodeType: "text",
                },
              ],
              nodeType: "paragraph",
            },
          ],
          nodeType: "document",
        },
      },
    },
    {
      name: "title",
      component: "button-select",
      label: "Title",
      required: true,
      validate: [
        {
          type: "required",
        },
      ],
      options: [
        {
          value: "Mr",
        },
        {
          value: "Mrs",
        },
        {
          value: "Miss",
        },
        {
          value: "Ms",
        },
        {
          value: "Mx",
        },
        {
          value: "Dr",
        },
      ],
      initialValue: person.title,
      initializeOnMount: true,
    },
    {
      name: "firstName",
      component: "text-field",
      label: "First name",
      required: false,
      placeholder: "e.g. John",
      disabled: true,
      helperText: "Sorry, you can't change this online.",
      initialValue: person.firstName,
      initializeOnMount: true,
    },
    {
      name: "middleName",
      component: "text-field",
      label: "Middle name",
      helperText: "Include this if you have one.",
      required: false,
      placeholder: "e.g. James",
      validate: [
        {
          type: "name",
          message: "Please enter a valid middle name",
          nameType: "middleName",
        },
      ],
      initialValue: person.middleName,
      initializeOnMount: true,
    },
    {
      name: "surname",
      component: "text-field",
      label: "Last name",
      required: true,
      placeholder: "e.g. Smith",
      validate: [
        {
          type: "required",
          message: "Please enter a valid last name",
        },
        {
          type: "name",
          message: "Please enter a valid last name",
          nameType: "lastName",
        },
      ],
      initialValue: person.surname,
      initializeOnMount: true,
    },
    {
      name: "submit",
      component: "wizard-submit-button",
      label: "Update name",
      validate: [],
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
                  data: {
                    uri: "tel:131703",
                  },
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
                {
                  data: {},
                  marks: [],
                  value: ".",
                  nodeType: "text",
                },
              ],
              nodeType: "paragraph",
            },
          ],
          nodeType: "document",
        },
      },
      errorTitle: "Sorry, we are unable to update your details.",
      successTitle: "You've updated your name",
      errorButtonText: "Okay",
      successButtonText: "Okay",
    },
    {
      name: "cancel",
      component: "wizard-cancel-button",
      label: "Cancel",
      modalTitle: "Are you sure you want to cancel?",
      confirmText: "Yes, please cancel",
      cancelText: "No, go back",
    },
  ];
};
