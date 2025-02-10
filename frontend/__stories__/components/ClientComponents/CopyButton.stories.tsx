import CopyButton from '@/components/ClientComponents/CopyButton';

export default {
  title: 'Components/Client Components/Copy Button',
  component: CopyButton,
  tags: ['autodocs']
};

export const Default = () => {
  return <CopyButton text='Text to copy' />;
};

export const TextCopied = () => {
  return <CopyButton text='Text to copy' isOpen={true} />;
};
