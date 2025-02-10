import { type PropsWithChildren } from 'react';
import { PageContainerGrid, PageContentGrid } from '../StyledComponents/PageTemplateContainer.styled';

const defaultContentWidth = { xs: '100%', sm: '600px' };
const defaultGap = 3;

export interface AppPageTemplateContainerProps extends PropsWithChildren {
  contentWidth?: string | { xs?: string; sm?: string; md?: string; lg?: string; xl?: string };
  spaceBetweenSections?: number;
}
export const PageTemplateContainer: React.FC<AppPageTemplateContainerProps> = ({
  children,
  contentWidth = defaultContentWidth,
  spaceBetweenSections = defaultGap
}) => {
  return (
    <PageContainerGrid container>
      <PageContentGrid container width={contentWidth} gap={spaceBetweenSections}>
        {children}
      </PageContentGrid>
    </PageContainerGrid>
  );
};
