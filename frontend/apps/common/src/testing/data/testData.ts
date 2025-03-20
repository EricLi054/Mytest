import type { RichTextProps } from "#types/common/richTextProps";
import type { Article } from "#types/horizons/article";
import type { Author } from "#types/horizons/author";
import type { Category } from "#types/horizons/category";
import type { Page } from "#types/horizons/page";
import type { YoutubeEmbedProps } from "#types/horizons/youtubeEmbed";
import { BLOCKS } from "@contentful/rich-text-types";

import type { CloudinaryAsset } from "@racwa/ui";

export const TestCategory: Category = {
  name: "Drive",
  slug: "drive",
  colour: "Red",
};

export const TestBio: RichTextProps = {
  json: {
    nodeType: BLOCKS.DOCUMENT,
    content: [
      {
        nodeType: BLOCKS.PARAGRAPH,
        content: [
          {
            nodeType: "text",
            value: "This is some bio text for an author",
            marks: [],
            data: {},
          },
        ],
        data: {},
      },
    ],
    data: {},
  },
};

export const TestAuthor: Author = {
  name: "Author Name",
  slug: "author-slug",
  profilePicture: [
    {
      secure_url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
      url: "",
      tags: [],
      type: "",
      bytes: 0,
      width: 0,
      format: "",
      height: 0,
      context: null,
      version: 0,
      duration: 0,
      metadata: {},
      public_id: "",
      created_at: "",
      original_url: "",
      resource_type: "",
    },
  ],
  bio: TestBio,
};

export const TestVideoImageThumbnail: CloudinaryAsset = {
  title: "Video Image",
  image: [
    {
      secure_url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
      url: "",
      tags: [],
      type: "",
      bytes: 0,
      width: 0,
      format: "",
      height: 0,
      context: null,
      version: 0,
      duration: 0,
      metadata: {},
      public_id: "",
      created_at: "",
      original_url: "",
      resource_type: "",
    },
  ],
  image_data: [
    {
      context: {
        custom: {
          alt: "Open Graph Image",
          caption: "Open Graph Image caption",
        },
      },
    },
  ],
  showCaption: false,
  link: "",
  openLinkInNewTab: false,
  fillContainerWidth: false,
};

export const TestArticle: Article = {
  title: "Article Title",
  author: {
    name: "Author Name",
    profilePicture: [
      {
        secure_url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
        url: "",
        tags: [],
        type: "",
        bytes: 0,
        width: 0,
        format: "",
        height: 0,
        context: null,
        version: 0,
        duration: 0,
        metadata: {},
        public_id: "",
        created_at: "",
        original_url: "",
        resource_type: "",
      },
    ],
    bio: {
      ...TestBio,
    },
  },
  category: {
    ...TestCategory,
  },
  redirectUrl: "https://www.rac.com.au",
  lastUpdated: "2025-01-01T00:00:00.000Z",
  published: "2021-10-01T00:00:00.000Z",
  renderTags: true,
  showArticleSummary: true,
  bannerImage: {
    title: "Banner Image",
    image: [
      {
        secure_url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
        url: "",
        tags: [],
        type: "",
        bytes: 0,
        width: 0,
        format: "",
        height: 0,
        context: null,
        version: 0,
        duration: 0,
        metadata: {},
        public_id: "",
        created_at: "",
        original_url: "",
        resource_type: "",
      },
    ],
    image_data: [
      {
        context: {
          custom: {
            alt: "Open Graph Image",
            caption: "Open Graph Image caption",
          },
        },
      },
    ],
    showCaption: false,
    link: "",
    openLinkInNewTab: false,
    fillContainerWidth: false,
  },
  contentfulMetadata: {
    tags: [
      {
        id: "tagA",
        name: "Tag A",
      },
      {
        id: "tagB",
        name: "Tag B",
      },
    ],
  },
  seoMetaTags: {
    title: "SEO Title",
    description: "SEO Description",
    allowSearchEngineFollowing: true,
    allowSearchEngineIndexing: true,
    openGraphImage: {
      title: "Open Graph Image",
      image: [
        {
          secure_url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
          url: "",
          tags: [],
          type: "",
          bytes: 0,
          width: 0,
          format: "",
          height: 0,
          context: null,
          version: 0,
          duration: 0,
          metadata: {},
          public_id: "",
          created_at: "",
          original_url: "",
          resource_type: "",
        },
      ],
      image_data: [
        {
          context: {
            custom: {
              alt: "Open Graph Image",
              caption: "Open Graph Image caption",
            },
          },
        },
      ],
      showCaption: false,
      link: "",
      openLinkInNewTab: false,
      fillContainerWidth: false,
    },
    openGraphDescription: "Open Graph Description",
    openGraphSiteName: "Open Graph Site Name",
    openGraphTitle: "Open Graph Title",
    openGraphUrl: "https://www.rac.com.au",
  },
  slug: "drive/test-article",
  sys: {
    firstPublishedAt: "2021-10-01T00:00:00.000Z",
    publishedAt: "2021-10-01T00:00:00.000Z",
    publishedVersion: 1,
  },
  tileImage: {
    title: "Tile Image",
    image: [
      {
        secure_url: "https://res.rac.com.au/rac-horizons/image/upload/v1742261818/600x400_je8zve.svg",
        url: "",
        tags: [],
        type: "",
        bytes: 0,
        width: 0,
        format: "",
        height: 0,
        context: null,
        version: 0,
        duration: 0,
        metadata: {},
        public_id: "",
        created_at: "",
        original_url: "",
        resource_type: "",
      },
    ],
    image_data: [
      {
        context: {
          custom: {
            alt: "Open Graph Image",
            caption: "Open Graph Image caption",
          },
        },
      },
    ],
    showCaption: false,
    link: "",
    openLinkInNewTab: false,
    fillContainerWidth: false,
  },
  leadParagraph: "Lead paragraph",
  content: {
    json: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          content: [
            {
              nodeType: "text",
              marks: [],
              value: "This is some text from a paragraph",
              data: {},
            },
          ],
          data: {},
        },
      ],
    },
  },
  relatedArticlesCollection: {
    items: [
      {
        __typename: "horizons_Article",
        sys: {
          id: "123456",
        },
      },
    ],
  },
  richMedia: {
    title: "Rich Media",
    url: "https://www.rac.com.au",
    mediaType: "Video",
    durationValue: 30,
    durationUnit: "Minutes",
    videoImageThumbnail: TestVideoImageThumbnail,
  },
};

export const TestYouTubeVideo: YoutubeEmbedProps = {
  title: "YouTube Video",
  url: "https://www.youtube.com/watch?v=123456",
  mediaType: "Video",
  durationValue: 14,
  durationUnit: "Minutes",
  videoImageThumbnail: TestVideoImageThumbnail,
};

export const TestPage: Page = {
  title: "Page Title",
  slug: "page-slug",
  seoMetaTags: TestArticle.seoMetaTags,
  contentCollection: {
    items: [
      {
        __typename: "typename",
        sys: {
          id: "123",
        },
      },
    ],
  },
  sys: {
    publishedAt: "2021-10-01T00:00:00.000Z",
    firstPublishedAt: "2021-10-01T00:00:00.000Z",
    publishedVersion: 1,
  },
};
