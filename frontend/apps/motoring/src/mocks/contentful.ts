import type { ConfirmVehicleContentfulSchema } from "#app/roadside-assistance/update-your-vehicle/(form)/confirm-vehicle/schema";
import type { ConfirmationPageSchema } from "#app/roadside-assistance/update-your-vehicle/(form)/confirmation/schema";
import type { UpdateVehicleContentfulSchema } from "#app/roadside-assistance/update-your-vehicle/(form)/update-vehicle/schema";
import type { YourVehicleContentfulSchema } from "#app/roadside-assistance/update-your-vehicle/(form)/your-vehicle/schema";
import type { ErrorPageSchema } from "#contentful/schema";
import type { z } from "zod";

export const mockYourVehicleContentfulData: z.infer<typeof YourVehicleContentfulSchema> = {
  heading: "Your vehicle",
  fields: {
    vehicleUse: {
      label: "What do you use your vehicle for?",
      requiredErrorMessage: "Please select what you use your vehicle for",
      invalidErrorMessage: "Please select what you use your vehicle for",
      tooltipTitle: "Vehicle use",
      tooltipContent: {
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
                  value: "Private use: Your vehicle is used for social or domestic purposes or travelling to work.",
                  marks: [],
                  data: {},
                },
                {
                  nodeType: "text",
                  value:
                    "Business use: Your vehicle is used for any sort of business, including use by a tradesperson, for ridesharing, courier or delivery.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
    isBrokenDown: {
      label: "Is your vehicle broken down now?",
      requiredErrorMessage: "Please confirm if your vehicle is broken down now",
      invalidErrorMessage: "Please confirm if your vehicle is broken down now",
    },
  },
  notifications: {
    vehicleBrokenDownNotificationCard: {
      name: "Vehicle Broken Down Notification Card",
      title: "Sorry, you can't continue online",
      severity: "error",
      content: {
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
                  value: "Please call us on 13 11 11 so we can help you.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
    businessUseNotificationCard: {
      name: "Business Use Notification Card",
      title: "Sorry, you can't continue online",
      severity: "error",
      content: {
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
                  value: "To update vehicles for business use, please call us on 13 17 03.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
  },
};

export const mockConfirmVehicleContentfulData: z.infer<typeof ConfirmVehicleContentfulSchema> = {
  heading: "Confirm this is your vehicle",
  cards: {
    importantInformation: {
      name: "importantInformation",
      title: "Important Information",
      content: {
        json: {
          nodeType: "document",
          data: {},
          content: [
            {
              nodeType: "ordered-list",
              data: {},
              content: [
                {
                  nodeType: "list-item",
                  data: {},
                  content: [
                    {
                      nodeType: "paragraph",
                      data: {},
                      content: [
                        {
                          nodeType: "text",
                          value: "You can only update your vehicle once per product year.",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                  ],
                },
                {
                  nodeType: "list-item",
                  data: {},
                  content: [
                    {
                      nodeType: "paragraph",
                      data: {},
                      content: [
                        {
                          nodeType: "text",
                          value: "Your vehicle must be licensed, roadworthy, and for private use only.",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                  ],
                },
                {
                  nodeType: "list-item",
                  data: {},
                  content: [
                    {
                      nodeType: "paragraph",
                      data: {},
                      content: [
                        {
                          nodeType: "text",
                          value: "There are limitations for heavy or oversized vehicles. Extra charges may apply.",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                  ],
                },
                {
                  nodeType: "list-item",
                  data: {},
                  content: [
                    {
                      nodeType: "paragraph",
                      data: {},
                      content: [
                        {
                          nodeType: "text",
                          value: "Waiting periods may apply.",
                          marks: [],
                          data: {},
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              nodeType: "paragraph",
              data: {},
              content: [
                {
                  nodeType: "text",
                  value: "Refer to ",
                  marks: [],
                  data: {},
                },
                {
                  nodeType: "hyperlink",
                  data: {
                    uri: "/car-motoring/roadside-assistance/compare/roadside-entitlements-guide",
                  },
                  content: [
                    {
                      nodeType: "text",
                      value: "Roadside Assistance Entitlements",
                      marks: [],
                      data: {},
                    },
                  ],
                },
                {
                  nodeType: "text",
                  value: " for full terms and conditions.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
  },
};

export const mockUpdateVehicleContentfulData: z.infer<typeof UpdateVehicleContentfulSchema> = {
  heading: "Let's update your vehicle",
  subheading: "You can update your vehicle or just your registration. To get started, please search for your vehicle.",
  fields: {
    vehicleType: {
      label: "Type of vehicle you're updating to",
      requiredErrorMessage: "Please select the type of vehicle",
      invalidErrorMessage: "Please select the type of vehicle",
    },
    vehicleRego: {
      label: "Enter your registration to find your vehicle",
      placeholder: "e.g. RAC123",
      requiredErrorMessage: "Please search with your registration",
      invalidErrorMessage: "Please search with your registration",
    },
    vehicleSelect: {
      label: "Select to confirm your vehicle",
      requiredErrorMessage: "Please select your vehicle",
      invalidErrorMessage: "Please select your vehicle",
    },
    vehicleColour: {
      label: "Vehicle colour",
      placeholder: "Please select a colour",
      requiredErrorMessage: "Please select your vehicle colour",
      invalidErrorMessage: "Please select your vehicle colour",
    },
    vehicleNotFound: {
      label: "No results found",
      requiredErrorMessage: "Please call us to find your vehicle",
      invalidErrorMessage: "Please call us to find your vehicle",
    },
  },
  notifications: {
    oversizeOrOverweightVehicle: {
      name: "Oversize or Overweight Vehicle Notification Card",
      title: "Oversize or Overweight Vehicle",
      severity: "warning",
      content: {
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
                    "Extra towing charges may apply or the vehicle may not be covered. For more information, please call us on 13 17 03.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
    cantFindVehicle: {
      name: "Can't Find Your Vehicle Notification Card",
      title: "Can't find your vehicle or don't have your registration?",
      severity: "info",
      content: {
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
                  value: "Please call us on 13 17 03.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
  },
};

export const mockConfirmationContentfulData: z.infer<typeof ConfirmationPageSchema> = {
  heading: "",
  subheading: "You've updated the vehicle on your Roadside Assistance.",
  cards: {
    motorcycleInsuranceCard: {
      name: "motorcycleInsuranceCard",
      title: "If you have motorcycle insurance",
      content: {
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
                  value: "To update your vehicle for your motorcycle insurance, please call us on ",
                  marks: [],
                  data: {},
                },
                {
                  nodeType: "hyperlink",
                  data: {
                    uri: "tel:131703",
                  },
                  content: [
                    {
                      nodeType: "text",
                      value: "13 17 03",
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
    carInsuranceCard: {
      name: "carInsuranceCard",
      title: "If you have car insurance",
      content: {
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
                  value: "You can update your vehicle for your car insurance in myRAC.",
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    },
  },
};

export const mockChangeAlreadyMadeContentfulData: z.infer<typeof ErrorPageSchema> = {
  rac_stepperFormErrorPage: {
    heading: "Uh oh!",
    subheading: "Sorry, you can't continue online",
    content: {
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
                value: "You have already updated your vehicle once this product year as per your entitlements.",
                marks: [],
                data: {},
              },
            ],
          },
          {
            nodeType: "paragraph",
            data: {},
            content: [
              {
                nodeType: "text",
                value: "Please call us on ",
                marks: [],
                data: {},
              },
              {
                nodeType: "hyperlink",
                data: {
                  uri: "tel:131703",
                },
                content: [
                  {
                    nodeType: "text",
                    value: "13 17 03",
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: "text",
                value: " to discuss.",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  },
};

export const mockUpdateNotAllowedContentfulData: z.infer<typeof ErrorPageSchema> = {
  rac_stepperFormErrorPage: {
    heading: "Uh oh!",
    subheading: "Sorry, you can't continue online",
    content: {
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
                value: "Please call us on ",
                marks: [],
                data: {},
              },
              {
                nodeType: "hyperlink",
                data: {
                  uri: "tel:131703",
                },
                content: [
                  {
                    nodeType: "text",
                    value: "13 17 03",
                    marks: [],
                    data: {},
                  },
                ],
              },
              {
                nodeType: "text",
                value: " to discuss.",
                marks: [],
                data: {},
              },
            ],
          },
        ],
      },
    },
  },
};
