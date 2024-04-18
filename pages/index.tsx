"use client";
import React, { useEffect, useState } from "react";
import CalDownloadLink from "./CalDownloadLink";
import eventInfo from "../interfaces/eventInfo";
import Tesseract from "tesseract.js";

function App() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
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
      console.log(info);
      seteventInfos(info.schedules);
      setInteractions(info.interactions);
      console.log("Files uploaded successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };
  useEffect(() => {
    if (selectedFiles.length == 0) {
      setPreviews([]);
      return;
    }
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
    // free memory when ever this component is unmounted
    return () => {
      previews.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
    };
  }, [selectedFiles]);

  return (
    <div>
      <h1>Image Upload</h1>
      <div></div>
      <h4>
        Upload your prescriptions here and it will generate a schedule for you!
      </h4>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*"
      />
      {previews.map((preview, index) => (
        <ul key={index}>
          <img src={preview} width={"300px"} />
        </ul>
      ))}
      <button onClick={handleSubmit}>Upload files</button>
      {loading ? (
        <div>Loading...</div>
      ) : eventInfos.length === 0 ? (
        <></>
      ) : (
        <ul>
          <CalDownloadLink data={eventInfos} />
          {interactions.map((row, index) => (
            <div key={index}>
              <div>Level: {row[0]}</div>
              <div>Drugs: {row[1] + ", " + row[2]}</div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
