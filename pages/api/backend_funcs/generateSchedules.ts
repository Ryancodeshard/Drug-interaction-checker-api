import drugInfo from "@/interfaces/drugInfo";

// Function to generate .ics file
const generateSchedules = (data: drugInfo[]) =>{
  // Create a new calendar
  let res:any = []
  const interval_timings_map: { [index: number]: number[] } = {
    1: [9],
    2: [10, 19],
    3: [8, 12, 18],
    4: [8, 12, 18, 21],
    5: [5, 9, 12, 17, 21],
    6: [2, 6, 10, 14, 18, 21],
    8: [1, 3, 6, 9, 12, 15, 18, 21],
  };

  // Loop through the data to create events for each medication
  data.forEach((drug: drugInfo) => {
    // Loop to add events for each time the medicine should be taken
    if (!(drug.timesPerDay in Object.keys(interval_timings_map))) console.error("Error in passed values");
    interval_timings_map[drug.timesPerDay].forEach((startTime: number) => {
      const start = new Date();
      start.setHours(startTime,0,0,0);
      const end = new Date();
      end.setHours(startTime + 1,0,0,0);
      res.push({
        start: start,
        end: end, // End time is 1 hour after start time
        summary: `Take ${drug.dosage} pill(s) of ${drug.medName}`,
        description: `It's time to take ${drug.dosage} of ${
          drug.medName}\n\
        ${drug.remarks}
        `
      })
    });
  });
  return res;
}

export default generateSchedules