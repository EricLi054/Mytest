"use client";

import type { DropDownItem, MenuItemsCollection } from "#types/common/categorySelect";
import type {
  CategorySelectItemCollection,
  ContentfulCategorySelectComponents,
} from "#types/common/categorySelectComponents";
import type { ContentfulItem } from "#types/common/contentfulItem";
import { useEffect, useState } from "react";
import { Box, Container, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Grid2";

import ComponentSwitcher from "../componentSwitcher";
import { getCategorySelectComponents } from "./actions";
import { styles } from "./styles";

function WebsiteDropDown({ items }: MenuItemsCollection) {
  //add categories to array
  const categories: DropDownItem[] = items;
  const [value, setValue] = useState("");
  const [contentItems, setContentItems] = useState<CategorySelectItemCollection>();

  useEffect(() => {
    if (value) {
      const getComponents = async () => {
        const data = await getCategorySelectComponents(value);
        if (data) {
          const results = data.data as ContentfulCategorySelectComponents;
          setContentItems(results.rac_categorySelect.contentCollection);
        }
      };

      if (value != "") {
        void getComponents();
      }
    }
  }, [value]);

  return (
    <Container sx={{ position: "relative" }} maxWidth="lg">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={styles.dropdownBox}>
            <InputLabel sx={styles.dropdownLabel} id="dropdownLbl">
              I need help with
            </InputLabel>
            <FormControl sx={styles.dropdownSelect}>
              <Select
                displayEmpty
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                {categories.map((menuItem: DropDownItem) => (
                  <MenuItem key={menuItem.sys.id} value={menuItem.sys.id}>
                    {menuItem.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        {contentItems?.items.map((item: ContentfulItem) => {
          return <ComponentSwitcher key={item.sys.id} component={item} />;
        })}
      </Grid>
    </Container>
  );
}

export default WebsiteDropDown;
