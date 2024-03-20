import { Inter } from "next/font/google";
import React, { useRef, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type InteractionObj = {
  drugs: string;
  severity: string;
  recommendation: string;
};

export default function Home() {
  const [res, setRes] = useState<InteractionObj[]>([]);
  const inputRef = useRef<any>();

  const handleClick = async () => {
    console.log(inputRef.current.value);
    const response = await fetch("/api/interaction-checker", {
      method: "POST",
      body: inputRef.current.value,
    });
    const res = await response.json();
    const obj: { interactions: InteractionObj[] } = JSON.parse(res);
    console.log(obj.interactions);
    setRes(obj.interactions ?? []);
  };

  return (
    <>
      <div>
        {res.length === 0
          ? "No drug interactions found"
          : res.map((obj, key) => (
              <div key={key}>
                <ul>
                  <li>Drugs: {obj.drugs}</li>
                  <li>Severity: {obj.severity}</li>
                  <li>Reccomendation: {obj.recommendation}</li>
                </ul>
              </div>
            ))}
      </div>
      <input placeholder="Panadol,warfarin,iodine" ref={inputRef} />
      <button onClick={handleClick}>Check for interactions</button>
    </>
  );
}
