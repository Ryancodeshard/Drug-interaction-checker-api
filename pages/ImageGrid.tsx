import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import imgInfo from "@/interfaces/imgInfo";

export default function ImageGrid({
  itemData,
  handleClear,
}: {
  itemData: imgInfo[];
  handleClear: any;
}) {
  return (
    <ImageList
      sx={{
        width: 500,
        height: 450,
      }}
    >
      {itemData?.map((item, index) => (
        <ImageListItem
          key={index}
          sx={{
            width: "248px",
            height: "248px",
          }}
        >
          <img
            style={{ display: "block", margin: "auto" }}
            srcSet={`${item.fileUrl}`}
            src={`${item.fileUrl}`}
            alt={item.fileName}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.fileName}
            position="top"
            actionIcon={
              <IconButton
                onClick={() => handleClear(index)}
                sx={{ color: "white" }}
                aria-label={`star ${item.fileName}`}
              >
                <ClearIcon />
              </IconButton>
            }
            actionPosition="left"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
