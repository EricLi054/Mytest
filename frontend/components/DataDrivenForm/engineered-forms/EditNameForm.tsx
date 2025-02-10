'use client';

import { useEffect, useState } from 'react';
import { useFormApi } from '@data-driven-forms/react-form-renderer';
import { useRouter } from 'next/navigation';
import { EditNameLoading } from './EditNameLoading';
import getNameMetadata from '@/graphql/getNameMetadata';
import { type PersonInformation } from '@/types/backendTypes/personInformation';
import NameChangeConfirmationContent from './NameChangeConfirmationContent';
import logNameChangeEvent from '@/utilities/logNameChangeEvent';

const populateSchema = (values: PersonInformation) => {
  return [
    {
      name: 'info',
      component: 'info-alert',
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
                      type: 'bold'
                    }
                  ],
                  value: 'Please use your legal name',
                  nodeType: 'text'
                }
              ],
              nodeType: 'paragraph'
            }
          ],
          nodeType: 'document'
        }
      }
    },
    {
      name: 'title',
      component: 'button-select',
      label: 'Title',
      required: true,
      validate: [
        {
          type: 'required'
        }
      ],
      options: [
        {
          value: 'Mr'
        },
        {
          value: 'Mrs'
        },
        {
          value: 'Miss'
        },
        {
          value: 'Ms'
        },
        {
          value: 'Mx'
        },
        {
          value: 'Dr'
        }
      ],
      initialValue: values.title,
      initializeOnMount: true
    },
    {
      name: 'firstName',
      component: 'text-field',
      label: 'First name',
      required: true,
      placeholder: 'e.g. John',
      validate: [
        {
          type: 'required',
          message: 'Please enter a valid first name'
        },
        {
          type: 'name',
          message: 'Please enter a valid first name',
          nameType: 'firstName'
        }
      ],
      initialValue: values.firstName,
      initializeOnMount: true
    },
    {
      name: 'middleName',
      component: 'text-field',
      label: 'Middle name',
      helperText: 'Include this if you have one.',
      required: false,
      placeholder: 'e.g. James',
      validate: [
        {
          type: 'name',
          message: 'Please enter a valid middle name',
          nameType: 'middleName'
        }
      ],
      initialValue: values.middleName,
      initializeOnMount: true
    },
    {
      name: 'surname',
      component: 'text-field',
      label: 'Last name',
      required: true,
      placeholder: 'e.g. Smith',
      validate: [
        {
          type: 'required',
          message: 'Please enter a valid last name'
        },
        {
          type: 'name',
          message: 'Please enter a valid last name',
          nameType: 'lastName'
        }
      ],
      initialValue: values.surname,
      initializeOnMount: true
    },
    {
      name: 'submit',
      component: 'wizard-submit-button',
      label: 'Update name',
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
                  value: 'Please try again later or call ',
                  nodeType: 'text'
                },
                {
                  data: {
                    uri: 'tel:131703'
                  },
                  content: [
                    {
                      data: {},
                      marks: [],
                      value: '13 17 03',
                      nodeType: 'text'
                    }
                  ],
                  nodeType: 'hyperlink'
                },
                {
                  data: {},
                  marks: [],
                  value: '.',
                  nodeType: 'text'
                }
              ],
              nodeType: 'paragraph'
            }
          ],
          nodeType: 'document'
        }
      },
      errorTitle: 'Sorry, we are unable to update your details.',
      successTitle: "You've updated your name",
      errorButtonText: 'Okay',
      successButtonText: 'Okay',
      requiresConfirmation: (dirtyValues: Record<string, boolean>): boolean => {
        if (dirtyValues.firstName) {
          return true;
        }
        return false;
      },
      confirmationTitle: 'Your first name is important',
      ConfirmationContent: NameChangeConfirmationContent,
      confirmationLogger: logNameChangeEvent
    },
    {
      name: 'cancel',
      component: 'wizard-cancel-button',
      label: 'Cancel',
      modalTitle: 'Are you sure you want to cancel?',
      confirmText: 'Yes, please cancel',
      cancelText: 'No, go back'
    }
  ];
};

export const EditNameFormStep2 = () => {
  const [data, setData] = useState<any>(undefined);
  const router = useRouter();
  const { renderForm } = useFormApi();

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getNameMetadata();
        setData(populateSchema(data.person));
      } catch (e) {
        router.push('/error');
      }
    };
    void getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return data ? renderForm(data) : <EditNameLoading />;
};
