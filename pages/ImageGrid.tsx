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
        minWidth: "80vw",
        minHeight: "20vh",
        width: "100%",
        height: "100%",
      }}
    >
      {itemData?.map((item, index) => (
        <ImageListItem
          key={index}
          sx={{
            width: "100%",
            height: "100%",
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
