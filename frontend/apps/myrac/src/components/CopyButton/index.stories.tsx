import CopyButton from ".";

export default {
  title: "MyRAC/Components/Client Components/Copy Button",
  component: CopyButton,
  tags: ["@racwa/myrac"],
};

export const Default = () => {
  return <CopyButton text="Text to copy" />;
};

export const TextCopied = () => {
  return <CopyButton text="Text to copy" isOpen={true} />;
};
