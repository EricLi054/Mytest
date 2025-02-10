import { MFAJourneyKeys } from '@/components/ClientComponents/MFA/Types/MFAJourneyKeys';
import getData from '../getData';

const query = `
query policyDetails($sessionKey: String!) {
  memberProducts(sessionKey: $sessionKey) {
   registrationNumber
    subtitle
    subtitleSecondary
    title
    type
    actions {
      label
      link
      type
      analytics {
        description
      }
      subActions {
        label
        link
        subLabel
        analytics {
          description
        }
      }
    }
    alerts {
      message
      severity
    }
    policyItems {
      label
      value
      bundledAmount {
        label
        message
        title
        bundledProducts {
          asset
          productName
        }
      }
      paymentFrequency {
        frequency
        link
        linkText
        message
        preMessage
        title
      }
      paymentMethod {
        accountNumber
        bsb
        cardExpiry
        cardNumber
        link
        linkText
        title
        type
      }
      tooltip {
        message
        title
      }
    }
  }
}
`;

const variables = {
  sessionKey: MFAJourneyKeys.manageContact
};

const policyDetailsQuery = async (token: string | null = null): Promise<any> => {
  const result: any = await getData(query, token, variables);
  if (!result?.memberProducts) {
    console.error('Error: policyDetailQuery failed with no member products');
  }

  return result?.memberProducts;
};

export default policyDetailsQuery;
