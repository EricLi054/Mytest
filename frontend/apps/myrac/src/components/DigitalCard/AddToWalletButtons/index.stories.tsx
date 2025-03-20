import { AddToAppleWalletButton, AddToGoogleWalletButton } from ".";

export default {
  title: "MyRAC/Components/Digital Card/Add to Wallet Buttons",
  component: AddToAppleWalletButton,
  tags: ["@racwa/myrac"],
};

export const AddToAppleWallet = () => {
  return <AddToAppleWalletButton href="https://www.apple.com/au/wallet/" />;
};

export const AddToGoogleWallet = () => {
  return <AddToGoogleWalletButton href="https://wallet.google/" />;
};
