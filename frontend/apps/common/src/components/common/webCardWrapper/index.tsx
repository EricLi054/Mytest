"use client";

import type { ComponentSwitcherProps } from "#types/common/componentSwitcherProps";
import type { ContentfulWebCardWrapper, WebCardWrapperDetails } from "#types/common/webCardWrapper";
import { useEffect, useState } from "react";
import { Container } from "@mui/material";

import WebCardFullWidth from "../layout/webCardFullWidth";
import WebCardGrid from "../layout/webCardGrid";
import { getWebCardWrapper } from "./data";

function WebCardWrapper(props: ComponentSwitcherProps) {
  const { data } = props;
  const [webCardWrapper, setWebCardWrapper] = useState<WebCardWrapperDetails>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: ContentfulWebCardWrapper = (await getWebCardWrapper(data.sys.id)) as ContentfulWebCardWrapper;
        setWebCardWrapper(result.data.rac_webCardWrapper);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void fetchData();
  }, [data.sys.id]);

  if (webCardWrapper != null) {
    return (
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        {webCardWrapper.rendering === "Grid" && <WebCardGrid webCards={webCardWrapper.webCardsCollection} />}
        {webCardWrapper.rendering === "Full width" && <WebCardFullWidth webCards={webCardWrapper.webCardsCollection} />}
      </Container>
    );
  }
}
export default WebCardWrapper;
