import type { ComponentSwitchableProps } from '@/types/ComponentSwitchableProps';
import CldImage from '@/components/ClientComponents/CldImage';
import { getComponent } from '@/graphql/getComponent';
import { getAccessToken } from '@/utilities/getAccessToken';
import React from 'react';

interface MustacheImageProps extends ComponentSwitchableProps {}

const fields = `
  title
  imageIdTemplate
  altTemplate
  borderRadius
`;

// The exceptions map for images that do not have svg version.
const nonSvgImageMap: Record<string, string> = {
  'myRAC/card-RAC Ignite-v2': 'png'
};

// This component only should be used for rendering svg images.
async function MustacheImage(props: MustacheImageProps): Promise<React.JSX.Element> {
  const { data } = props;

  const token = await getAccessToken();
  const resultData = await getComponent('mustacheImage', data.sys.id, fields, true, token);
  const imageIdTemplate = resultData?.imageIdTemplate;

  if (!imageIdTemplate) {
    console.error('Error: MustacheImage.tsx no imageIdTemplate for:', resultData?.title);
    return <React.Fragment />;
  }

  return (
    <CldImage
      fill
      format={nonSvgImageMap[imageIdTemplate] ?? 'svg'}
      src={imageIdTemplate}
      alt={resultData.altTemplate ?? imageIdTemplate}
      style={{ borderRadius: resultData.borderRadius ?? 3 }}
    />
  );
}

export default MustacheImage;
