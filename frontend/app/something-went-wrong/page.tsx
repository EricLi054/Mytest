import GenericErrorPage from '@/components/ClientComponents/GenericErrorPage';
import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'myRAC'
};

export default function SomethingWentWrongPage() {
  return (
    <>
      <GenericErrorPage />
    </>
  );
}
