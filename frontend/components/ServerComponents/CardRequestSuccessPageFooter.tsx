import { CardRequestFooter, CardRequestFooterItem } from '../StyledComponents/CardRequestSuccessPage.styled';

export interface CardRequestSuccessPageFooterProps {
  MyRACButton: () => JSX.Element;
  ProfileButton: () => JSX.Element;
}
const CardRequestSuccessPageFooter: React.FC<CardRequestSuccessPageFooterProps> = ({ MyRACButton, ProfileButton }) => {
  return (
    <CardRequestFooter container>
      <CardRequestFooterItem>
        <ProfileButton />
      </CardRequestFooterItem>
      <CardRequestFooterItem>
        <MyRACButton />
      </CardRequestFooterItem>
    </CardRequestFooter>
  );
};

export default CardRequestSuccessPageFooter;
