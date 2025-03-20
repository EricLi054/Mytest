import type { ComponentItem } from "#types/horizons/componentItem";
import React, { Suspense } from "react";

import Button from "../cms/button";
import CallToAction from "../cms/callToAction";
import CloudinaryAsset from "../cms/cloudinaryAsset";
import CtaBanner from "../cms/ctaBanner";
import FeaturedContent from "../cms/featuredContent";
import FilterableContent from "../cms/filterableContent";
import InstagramPost from "../cms/instagramPost";
import LinkList from "../cms/linkList";
import PageHeader from "../cms/pageHeader";
import Typography from "../cms/typography";
import VideoCarousel from "../cms/videoCarousel";
import YoutubeEmbed from "../cms/youtubeEmbed";
import ArticleGridSkeleton from "../rendering/skeletons/articleGridSkeleton";
import CarouselSkeleton from "../rendering/skeletons/carouselSkeleton";
import CTABannerSkeleton from "../rendering/skeletons/ctaBannerSkeleton";
import PageHeaderSkeleton from "../rendering/skeletons/pageHeaderSkeleton";

type ComponentSwitcherProps = {
  component: ComponentItem;
};

const keyMap: Record<string, React.ComponentType<{ data: ComponentItem }>> = {
  CtaBanner,
  VideoCarousel,
  FeaturedContent,
  FilterableContent,
  PageHeader,
  CallToAction,
  YoutubeEmbed,
  InstagramPost,
  CloudinaryAsset,
  Typography,
  Button,
  LinkList,
};

// TO DO - REPLACE ALL THESE WITH ACTUAL SKELETONS
const fallbackMap: Record<string, React.ReactNode> = {
  CtaBanner: <CTABannerSkeleton />,
  VideoCarousel: <CarouselSkeleton />,
  FeaturedContent: <CarouselSkeleton />,
  FilterableContent: <ArticleGridSkeleton />,
  PageHeader: <PageHeaderSkeleton />,
  CallToAction: <div>Loading Call to Action...</div>,
  YoutubeEmbed: <div>Loading YouTube Embed...</div>,
  InstagramPost: <div>Loading Instagram Post...</div>,
  CloudinaryAsset: <div>Loading Cloudinary Asset...</div>,
  Typography: <div>Loading Typography...</div>,
  Button: <div>Loading Button...</div>,
  LinkList: <div>Loading Link List...</div>,
};

function ComponentSwitcher(props: ComponentSwitcherProps) {
  const { component } = props;

  // Need to replace "horizons_" here with an empty string as the keyMap is defined without the prefix
  try {
    const Component = keyMap[component.__typename.replace("horizons_", "")];

    if (!Component) {
      console.error("Error: ComponentSwitcher.tsx Component not found: ", component.__typename);
      return null;
    }

    const fallback = fallbackMap[component.__typename.replace("horizons_", "")];

    if (!fallback) {
      console.error("Error: ComponentSwitcher.tsx Component not found: ", component.__typename);
      return null;
    }

    return (
      <>
        <Suspense fallback={fallback}>
          <Component data={component} />
        </Suspense>
      </>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default ComponentSwitcher;
