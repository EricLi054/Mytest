function migrationFunction(migration, context) {
  const engineeredContent = migration.createContentType("engineeredContent");
  engineeredContent
    .displayField("id")
    .name("Engineered Content")
    .description("");

  const engineeredContentId = engineeredContent.createField("id");
  engineeredContentId
    .name("ID")
    .type("Symbol")
    .localized(false)
    .required(true)
    .validations([{ unique: true }])
    .disabled(false)
    .omitted(false);

  const engineeredContentStringContent =
    engineeredContent.createField("stringContent");
  engineeredContentStringContent
    .name("String Content")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const engineeredContentIconContent =
    engineeredContent.createField("iconContent");
  engineeredContentIconContent
    .name("Icon Content")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const engineeredContentRichTextContent =
    engineeredContent.createField("richTextContent");
  engineeredContentRichTextContent
    .name("Rich Text Content")
    .type("RichText")
    .localized(false)
    .required(false)
    .validations([
      {
        enabledMarks: [
          "bold",
          "italic",
          "underline",
          "code",
          "superscript",
          "subscript",
          "strikethrough",
        ],
        message:
          "Only bold, italic, underline, code, superscript, subscript, and strikethrough marks are allowed",
      },
      {
        enabledNodeTypes: [
          "heading-1",
          "heading-2",
          "heading-3",
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "embedded-entry-block",
          "embedded-asset-block",
          "table",
          "asset-hyperlink",
          "embedded-entry-inline",
          "entry-hyperlink",
          "hyperlink",
        ],
        message:
          "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, block entry, asset, table, link to asset, inline entry, link to entry, and link to Url nodes are allowed",
      },
      { nodes: {} },
    ])
    .disabled(false)
    .omitted(false);

  const engineeredContentCloudinaryContent =
    engineeredContent.createField("cloudinaryContent");
  engineeredContentCloudinaryContent
    .name("Cloudinary Content")
    .type("Object")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  engineeredContent.changeFieldControl("id", "builtin", "singleLine");
  engineeredContent.changeFieldControl(
    "stringContent",
    "builtin",
    "singleLine"
  );
  engineeredContent.changeFieldControl("iconContent", "builtin", "singleLine");
  engineeredContent.changeFieldControl(
    "richTextContent",
    "builtin",
    "richTextEditor"
  );
  engineeredContent.changeFieldControl(
    "cloudinaryContent",
    "app",
    "zjcnWgBknf9zB7IM9HZjE"
  );
  engineeredContentCloudinaryContent.setAnnotations(
    ["Contentful:GraphQLFieldResolver"],
    {
      parameters: {
        appFunctionId: "main",
        appDefinitionId: "zjcnWgBknf9zB7IM9HZjE",
        cacheTTLInSeconds: 3600,
      },
    }
  );

  const standardErrorPage = migration.createContentType("standardErrorPage");
  standardErrorPage
    .displayField("title")
    .name("Standard Error Page")
    .description("Error pages using the standard error template.")
    .setAnnotations(["Contentful:AggregateRoot"]);

  const standardErrorPageTitle = standardErrorPage.createField("title");
  standardErrorPageTitle
    .name("Title")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const standardErrorPageSlug = standardErrorPage.createField("slug");
  standardErrorPageSlug
    .name("Slug")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([{ unique: true }])
    .disabled(false)
    .omitted(false);

  const standardErrorPageHeading = standardErrorPage.createField("heading");
  standardErrorPageHeading
    .name("Heading")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const standardErrorPageSubHeading =
    standardErrorPage.createField("subHeading");
  standardErrorPageSubHeading
    .name("Sub-Heading")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const standardErrorPageContent = standardErrorPage.createField("content");
  standardErrorPageContent
    .name("Content")
    .type("RichText")
    .localized(false)
    .required(false)
    .validations([
      {
        enabledMarks: [
          "bold",
          "italic",
          "underline",
          "code",
          "superscript",
          "subscript",
          "strikethrough",
        ],
        message:
          "Only bold, italic, underline, code, superscript, subscript, and strikethrough marks are allowed",
      },
      {
        enabledNodeTypes: [
          "heading-1",
          "heading-2",
          "heading-3",
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "table",
          "asset-hyperlink",
          "embedded-entry-inline",
          "entry-hyperlink",
          "hyperlink",
        ],
        message:
          "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, link to asset, inline entry, link to entry, and link to Url nodes are allowed",
      },
      { nodes: {} },
    ])
    .disabled(false)
    .omitted(false);

  const standardErrorPageMetaData = standardErrorPage.createField("metaData");
  standardErrorPageMetaData
    .name("Meta Data")
    .type("Link")
    .localized(false)
    .required(true)
    .validations([{ linkContentType: ["seoMetaData"] }])
    .disabled(false)
    .omitted(false)
    .linkType("Entry");
  standardErrorPage.changeFieldControl("title", "builtin", "singleLine");
  standardErrorPage.changeFieldControl("slug", "builtin", "slugEditor");
  standardErrorPage.changeFieldControl("heading", "builtin", "singleLine", {
    helpText: "Defaults to 'Uh oh!' if nothing entered.",
  });
  standardErrorPage.changeFieldControl("subHeading", "builtin", "singleLine", {
    helpText: "Defaults to 'Something went wrong' if nothing entered.",
  });
  standardErrorPage.changeFieldControl("content", "builtin", "richTextEditor");
  standardErrorPage.changeFieldControl(
    "metaData",
    "builtin",
    "entryLinkEditor"
  );
  standardErrorPage;

  const buttonContainer = migration.createContentType("buttonContainer");
  buttonContainer
    .displayField("title")
    .name("Button Container")
    .description("");

  const buttonContainerTitle = buttonContainer.createField("title");
  buttonContainerTitle
    .name("Title")
    .type("Symbol")
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  const buttonContainerStackTogether =
    buttonContainer.createField("stackTogether");
  buttonContainerStackTogether
    .name("Stack Together")
    .type("Boolean")
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false);

  const buttonContainerItemsPerRow = buttonContainer.createField("itemsPerRow");
  buttonContainerItemsPerRow
    .name("Items per row")
    .type("Integer")
    .localized(false)
    .required(false)
    .validations([{ in: [1, 2, 3, 4] }])
    .disabled(false)
    .omitted(false);

  const buttonContainerLargeWidth = buttonContainer.createField("largeWidth");
  buttonContainerLargeWidth
    .name("Large width")
    .type("Integer")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const buttonContainerColumnBreakpoint =
    buttonContainer.createField("columnBreakpoint");
  buttonContainerColumnBreakpoint
    .name("Column Breakpoint")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([{ in: ["sm", "md"] }])
    .defaultValue({ "en-US": "sm" })
    .disabled(false)
    .omitted(false);

  const buttonContainerGap = buttonContainer.createField("gap");
  buttonContainerGap
    .name("Gap")
    .type("Integer")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);

  const buttonContainerContentItems =
    buttonContainer.createField("contentItems");
  buttonContainerContentItems
    .name("Content Items")
    .type("Array")
    .localized(false)
    .required(true)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["button"] }],
      linkType: "Entry",
    });
  buttonContainer.changeFieldControl("title", "builtin", "singleLine");
  buttonContainer.changeFieldControl("stackTogether", "builtin", "boolean", {
    helpText:
      "Indicates if the buttons should have a gap when stacked on small screens",
    trueLabel: "Yes",
    falseLabel: "No",
  });
  buttonContainer.changeFieldControl("itemsPerRow", "builtin", "dropdown");
  buttonContainer.changeFieldControl("largeWidth", "builtin", "numberEditor", {
    helpText: "The width of the container on large viewports in units of 8",
  });
  buttonContainer.changeFieldControl("columnBreakpoint", "builtin", "dropdown");
  buttonContainer.changeFieldControl("gap", "builtin", "numberEditor", {
    helpText: "In units of 8 i.e. 1 = 8px",
  });
  buttonContainer.changeFieldControl(
    "contentItems",
    "builtin",
    "entryLinksEditor"
  );

  const gridItem = migration.editContentType("gridItem");
  const gridItemTextColour = gridItem.editField("textColour");
  gridItemTextColour.validations([
    { in: ["dieselDeep", "dieselDeeper", "white"] },
  ]);

  const gridItemTextAlign = gridItem.createField("textAlign");
  gridItemTextAlign
    .name("Text Align")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([{ in: ["center", "end", "start"] }])
    .disabled(false)
    .omitted(false);
  gridItem.moveField("textAlign").beforeField("contentItems");
  gridItem.changeFieldControl("textAlign", "builtin", "dropdown");

  const grid = migration.editContentType("grid");
  const gridContentItems = grid.editField("contentItems");
  gridContentItems.items({
    type: "Link",
    validations: [{ linkContentType: ["grid", "gridItem", "buttonContainer"] }],
    linkType: "Entry",
  });

  const gridBackground = grid.editField("background");
  gridBackground.validations([
    { in: ["dieselDeep", "dieselDeepest", "white", "racGrayLight"] },
  ]);

  const gridJustifyContent = grid.editField("justifyContent");
  gridJustifyContent.validations([{ in: ["center", "flex-start"] }]);

  const gridSpaceEvenly = grid.deleteField("spaceEvenly");
  const gridColumnBelowSmall = grid.deleteField("columnBelowSmall");
  const placeholder = migration.editContentType("placeholder");
  const placeholderEngineeredContent =
    placeholder.createField("engineeredContent");
  placeholderEngineeredContent
    .name("Engineered Content")
    .type("Array")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["engineeredContent"] }],
      linkType: "Entry",
    });
  placeholder.changeFieldControl(
    "engineeredContent",
    "builtin",
    "entryLinksEditor"
  );

  const link = migration.editContentType("link");
  const linkGoogleAnalyticsDescription = link.createField(
    "googleAnalyticsDescription"
  );
  linkGoogleAnalyticsDescription
    .name("Google analytics description")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  link.changeFieldControl(
    "googleAnalyticsDescription",
    "builtin",
    "singleLine",
    { helpText: "Used for Google analytics description field" }
  );

  const button = migration.editContentType("button");
  button.displayField("title");

  const buttonVariant = button.editField("variant");
  buttonVariant.validations([
    {
      in: [
        "Chevron",
        "Copy Button",
        "CTA Transparent",
        "Icon CTA",
        "Image",
        "Profile Link",
        "Regular",
        "Social Icon",
      ],
    },
  ]);

  const buttonIcon = button.editField("icon");
  buttonIcon.validations([
    {
      in: [
        "certificate",
        "edit",
        "facebook-square",
        "id-card",
        "info-circle",
        "instagram",
        "linkedin-in",
        "question",
        "question-circle",
        "shopping-basket",
        "shopping-cart",
        "twitter",
        "user",
      ],
    },
  ]);

  const buttonTitle = button.createField("title");
  buttonTitle
    .name("Title")
    .type("Symbol")
    .localized(false)
    .required(false)
    .validations([])
    .disabled(false)
    .omitted(false);
  button.moveField("title").beforeField("longText");
  button.changeFieldControl("title", "builtin", "singleLine");

  const dataDrivenFormField = migration.editContentType("dataDrivenFormField");
  const dataDrivenFormFieldRichText = dataDrivenFormField.editField("richText");
  dataDrivenFormFieldRichText.validations([
    {
      enabledMarks: [
        "bold",
        "italic",
        "underline",
        "code",
        "superscript",
        "subscript",
      ],
      message:
        "Only bold, italic, underline, code, superscript, and subscript marks are allowed",
    },
    {
      enabledNodeTypes: [
        "heading-1",
        "heading-2",
        "heading-3",
        "heading-4",
        "heading-5",
        "heading-6",
        "ordered-list",
        "unordered-list",
        "hr",
        "blockquote",
        "table",
        "hyperlink",
        "entry-hyperlink",
        "asset-hyperlink",
        "embedded-entry-inline",
      ],
      message:
        "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, table, link to Url, link to entry, link to asset, and inline entry nodes are allowed",
    },
    { nodes: {} },
  ]);

  const dataDrivenFormFieldComponent =
    dataDrivenFormField.editField("component");
  dataDrivenFormFieldComponent.validations([
    {
      in: [
        "address-input",
        "button",
        "button-select",
        "date-picker",
        "divider",
        "dual-list-select",
        "error-alert",
        "field-array",
        "fixed-label-plain-text",
        "info-alert",
        "input-addon-button-group",
        "input-addon-group",
        "plain-text",
        "redirect-edit",
        "rich-text",
        "select",
        "slider",
        "switch",
        "tab-item",
        "text-field",
        "time-picker",
        "wizard",
        "wizard-back-button",
        "wizard-cancel-button",
        "wizard-page",
        "wizard-submit-button",
        "engineered-form",
      ],
    },
  ]);

  const mustacheImage = migration.editContentType("mustacheImage");
  const mustacheImageBorderRadius = mustacheImage.createField("borderRadius");
  mustacheImageBorderRadius
    .name("Border Radius")
    .type("Integer")
    .localized(false)
    .required(false)
    .validations([
      { range: { min: 0 }, message: "Border radius must be a positive value" },
    ])
    .defaultValue({ "en-US": 4 })
    .disabled(false)
    .omitted(false);
  mustacheImage.changeFieldControl("borderRadius", "builtin", "numberEditor");
}
module.exports = migrationFunction;
