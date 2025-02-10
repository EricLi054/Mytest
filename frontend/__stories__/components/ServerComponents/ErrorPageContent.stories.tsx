import ErrorPageContent from '@/components/ServerComponents/ErrorPageContent';

export default {
  title: 'Components/Server Components/Error Page Content',
  component: ErrorPageContent,
  tags: ['autodocs']
};

export const NotFound = () => {
  return (
    <ErrorPageContent
      heading='404'
      title='Uh oh! We seem to be missing some parts'
      subtitle="Sorry, we can't find the page that you're looking for."
    />
  );
};
