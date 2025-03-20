import DropdownButton from ".";

export default {
  title: "MyRAC/Components/Client Components/Dropdown Button",
  component: DropdownButton,
  tags: ["@racwa/myrac"],
};

export const Default = () => {
  return (
    <DropdownButton
      primaryLabel="Manage"
      menuItems={[
        {
          label: "Item 1",
          link: "#",
        },
        {
          label: "Item 2",
          subLabel: "With sublabel",
          link: "#",
        },
      ]}
    >
      Manage
    </DropdownButton>
  );
};
