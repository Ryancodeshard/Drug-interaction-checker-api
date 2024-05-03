"use client";
import React, { useEffect, useState } from "react";
import CalDownloadLink from "./CalDownloadLink";
import eventInfo from "../interfaces/eventInfo";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  List,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import ImageGrid from "./ImageGrid";
import imgInfo from "@/interfaces/imgInfo";
import drugInfo from "@/interfaces/drugInfo";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

const fetchImage = async (url: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], "img.jpg", { type: "image/jpeg" });
    const base64str = await toBase64(file);
    return base64str;
  } catch (error) {
    console.error("Error fetching image:", error);
    throw error; // Re-throw the error to handle it outside this function if needed
  }
};

let exampleData: imgInfo[] = [];

const severityMap = {
  Minor: "yellow",
  Moderate: "orange",
  Major: "red",
  Unknown: "purple",
};

function App() {
  const [addedFiles, setAddedFiles] = useState<imgInfo[]>([]);
  const [interactions, setInteractions] = useState<interactionInfo[]>([]);
  const [medInfos, setMedInfos] = useState<drugInfo[]>([]);
  const [eventInfos, seteventInfos] = useState<eventInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bruh = async () => {
      exampleData = [
        {
          fileUrl: "/Methotrexate.jpg",
          fileName: "Methotrexate",
          fileObject: await fetchImage("/Methotrexate.jpg"),
        },
        {
          fileUrl: "/Amoxicillin.jpg",
          fileName: "Amoxicillin",
          fileObject: await fetchImage("/Amoxicillin.jpg"),
        },
      ];
    };
    bruh();
  }, []);

  const handleAddFiles = async (e: any) => {
    const files: File[] = Array.from(e.target.files);
    const filePromises = files.map(async (file) => {
      const base64Data = await toBase64(file);
      const blob = new Blob([file], { type: file.type });
      const fileURL = URL.createObjectURL(blob);
      return {
        fileName: file.name,
        fileUrl: fileURL,
        fileObject: base64Data as string,
      };
    });

    const addedFiles = await Promise.all(filePromises);
    setAddedFiles((prev) => [...prev, ...addedFiles]);
  };

  const handleUpload = async () => {
    try {
      if (addedFiles.length == 0) {
        alert("No files uploaded");
        return;
      }
      setLoading(true);
      let info: drugInfo[] = [];
      for (const file of addedFiles) {
        const response = await fetch("/api/parse_image", {
          method: "POST",
          body: JSON.stringify(file.fileObject),
        });
        const drug_dets = await response.json();
        info.push(drug_dets);
      }

      console.log(info);
      setMedInfos(info);
      console.log("Files parsed successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (medInfos.length == 0) {
        alert("No prescription infomration uploaded");
        return;
      }
      setLoading(true);
      const response = await fetch("/api/gen_cal", {
        method: "POST",
        body: JSON.stringify(medInfos),
      });

      const info = await response.json();
      console.log(info);
      seteventInfos(info.schedules);
      setInteractions(info.interactions);
      console.log("Files parsed successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleClear = (index: number) => {
    const newAdded = [
      ...addedFiles.slice(0, index),
      ...addedFiles.slice(index + 1),
    ];
    setAddedFiles(newAdded);
  };

  const formEdit = (index: number, fieldName: string, newValue: any) => {
    setMedInfos((prev: drugInfo[]) => {
      const newInfos = [...prev];
      newInfos[index] = {
        ...medInfos[index],
        [fieldName]: newValue,
      };
      return newInfos;
    });
  };

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      padding={"40px"}
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2">Med2Cal</Typography>
      <h3>Step 1: Upload Images</h3>
      <Box>
        <Button variant="contained" onClick={() => setAddedFiles(exampleData)}>
          Load Example
        </Button>
        <Button variant="contained" component="label">
          + Add Prescriptions
          <input
            type="file"
            multiple
            hidden
            onChange={handleAddFiles}
            accept="image/*"
          />
        </Button>
      </Box>
      <Box
        sx={{
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          border: "5px solid rgba(255, 255, 255, 0.3)",
          borderRadius: "16px",
        }}
      >
        <ImageGrid itemData={addedFiles} handleClear={handleClear} />
      </Box>
      <Button variant="contained" onClick={handleUpload}>
        Upload files
      </Button>
      <h3>Step 2: Check/Edit prescription info</h3>
      <List>
        {medInfos.map((row: drugInfo, index: number) => (
          <Box
            key={index}
            sx={{
              padding: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              border: "5px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "16px",
              margin: "10px",
            }}
          >
            <TextField
              label="Medicine name"
              value={row.medName}
              onChange={(e) => formEdit(index, "medName", e.target.value)}
            />
            <TextField
              label="Dosage"
              value={row.dosage}
              onChange={(e) => formEdit(index, "dosage", e.target.value)}
            />
            <TextField
              label="Times per day"
              type="number"
              value={row.timesPerDay}
              onChange={(e) => formEdit(index, "timesPerDay", e.target.value)}
            />
            <RadioGroup
              value={row.beforeMeal}
              onChange={(e) => formEdit(index, "beforeMeal", e.target.value)}
            >
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Before Meal"
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="After Meal"
              />
            </RadioGroup>
          </Box>
        ))}
      </List>
      <Button variant="contained" onClick={handleSubmit}>
        Generate calendar
      </Button>
      <Box>
        {loading ? (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor:
                "rgba(0, 0, 0, 0.5)" /* Adjust the alpha value (0.5 in this case) for the desired transparency */,
              zIndex: 9999,
              display: "flex" /* Use flexbox layout */,
              justifyContent: "center" /* Center content horizontally */,
              alignItems: "center" /* Center content vertically */,
            }}
          >
            <CircularProgress color="success" />
          </Box>
        ) : eventInfos.length === 0 ? (
          <></>
        ) : (
          <List>
            <h3>Step 3: Click on link to download!</h3>

            <CalDownloadLink data={eventInfos} />
            {interactions.length !== 0 && (
              <>
                <Typography variant="h4">Potential interactions</Typography>
                {interactions.map((row, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: `${
                        severityMap[row.level as keyof typeof severityMap]
                      }`,
                      padding: "10px",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                      border: "5px solid rgba(255, 255, 255, 0.3)",
                      borderRadius: "16px",
                    }}
                  >
                    <Typography variant="h5">Level: {row.level}</Typography>
                    <Typography fontWeight={600}>
                      {row.drugA + ", " + row.drugB}
                    </Typography>
                    {row.remarks.split("\n").map((i, key) => {
                      return <Typography key={key}>{i}</Typography>;
                    })}
                  </Box>
                ))}
              </>
            )}
          </List>
        )}
      </Box>
    </Box>
  );
}

export default App;
