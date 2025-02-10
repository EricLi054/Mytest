import DropdownButton from '@/components/ClientComponents/DropdownButton';

export default {
  title: 'Components/Client Components/Dropdown Button',
  component: DropdownButton,
  tags: ['autodocs']
};

export const Default = () => {
  return (
    <DropdownButton
      primaryLabel='Manage'
      menuItems={[
        {
          label: 'Item 1',
          link: '#'
        },
        {
          label: 'Item 2',
          subLabel: 'With sublabel',
          link: '#'
        }
      ]}
    >
      Manage
    </DropdownButton>
  );
};
