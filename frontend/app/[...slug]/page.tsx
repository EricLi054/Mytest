import LandingPage from './LandingPage';
import { contentQuery } from '@/graphql/queries/contentQuery';
import getData from '@/graphql/getData';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { slugPageMetaDataQuery } from '@/graphql/queries/slugPageMetaDataQuery';
import { getCrmId } from '@/utilities/getCrmId';
import { basicPersonQuery } from '@/graphql/queries/basicPersonQuery';
import { getAccessToken } from '@/utilities/getAccessToken';
import StandardErrorPage from './StandardErrorPage';
import { slugPageQuery } from '@/graphql/queries/slugPageQuery';
import { errorPage } from '@/utilities/errorPage';
import { NON_MEMBER_TYPE } from '@/types/backendTypes/personInformation';
import getADB2CAccount from '@/graphql/getADB2CAccount';
// defaults to 5 minutes revalidate if env var not available
export const revalidate = parseInt(process.env.CACHE_MAX_AGE as string) || 300;

interface SlugPageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const query = contentQuery(slugPageMetaDataQuery(params.slug.join('/')));
  const data = await getData(query);

  if (!data) {
    return {
      title: 'myRAC'
    };
  }

  const cmsData = JSON.parse(data.contentDataRequest[0]);
  const metaData = cmsData?.data?.page?.items[0]?.metaData || cmsData?.data?.errorPage?.items[0]?.metaData;

  if (!metaData) {
    return {
      title: 'myRAC'
    };
  }

  return {
    title: metaData.title,
    description: metaData.description
  };
}

export default async function Page({ params }: SlugPageProps) {
  const pageSlug = params.slug.join('/');
  const query = contentQuery(slugPageQuery(pageSlug));

  const data = await getData(query);

  if (!data) {
    console.error(`Error: [...slug]/page.tsx Slug: ${pageSlug}`);
    throw new Error('No data returned from CMS');
  }

  const cmsData = JSON.parse(data.contentDataRequest[0]);

  const pageData = cmsData?.data?.page?.items[0] || cmsData?.data?.errorPage?.items[0];
  if (!pageData) return notFound();

  const noLinkRedirect = pageData?.noLinkRedirect;
  if (noLinkRedirect) {
    const sessionCrmId = await getCrmId();
    if (sessionCrmId) {
      // If there is valid crmId in session
      const token = await getAccessToken();
      const personInformation = await getData(basicPersonQuery(), token);
      if (!personInformation.person?.firstName || personInformation.data === null) {
        return redirect(errorPage.somethingWentWrong);
      } else if (personInformation.person.membershipType === NON_MEMBER_TYPE) {
        return redirect(errorPage.membershipLapsed);
      }
    } else {
      const adb2cAccount = await getADB2CAccount();
      const crmId = adb2cAccount?.crmId;
      if (crmId) {
        // Refresh session
        return redirect(`/signIn?callbackUrl=/${pageSlug}&refresh=true`);
      } else {
        // Do product linking
        console.log(`No CRM ID or ADB2C account found for adb2cAccount: ${adb2cAccount?.id || 'NO ID'}`);
        return redirect(noLinkRedirect);
      }
    }
  }

  if (pageData.__typename === 'LandingPage') {
    return <LandingPage pageData={pageData} />;
  } else if (pageData.__typename === 'StandardErrorPage') {
    return <StandardErrorPage pageData={pageData} />;
  }

  return <></>;
}
