"use client";
import React, { useState } from "react";
import CalDownloadLink from "../CalDownloadLink";
import eventInfo from "../interfaces/eventInfo";
import Tesseract from "tesseract.js";

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [interactions, setInteractions] = useState<[]>([]);
  const [eventInfos, seteventInfos] = useState<eventInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: any) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      if (selectedFiles.length == 0) {
        alert("No files uploaded");
        return;
      }
      setLoading(true);
      const queries: Promise<string[]> = Promise.all(
        selectedFiles.map(async (file) => {
          const blob = new Blob([file], { type: file.type });
          const fileURL = URL.createObjectURL(blob);
          return await Tesseract.recognize(fileURL, "eng").then(
            ({ data: { text } }) => {
              console.log(text);
              return text;
            }
          );
        })
      );
      const response = await fetch("/api/parse_text", {
        method: "POST",
        body: JSON.stringify({ queries: await queries }),
      });

      const info = await response.json();
      // console.log(eventInfos);
      seteventInfos(info.schedules);
      setInteractions(info.interactions);
      console.log("Files uploaded successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      <h1>Image Upload</h1>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*"
      />
      <button onClick={handleSubmit}>Upload files</button>
      {loading ? (
        <div>Loading</div>
      ) : eventInfos.length === 0 ? (
        <></>
      ) : (
        <>
          <CalDownloadLink data={eventInfos} />
          {interactions.map((row) => (
            <div>
              Level:{row[0]} Drugs:{row[1] + "," + row[2]}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
