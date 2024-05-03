import ical, { ICalAlarmType, ICalEventRepeatingFreq } from "ical-generator";
import eventInfo from "../interfaces/eventInfo";

function convertToLocalWithOffset(datetimeString: string) {
  // Parse the datetime string
  const datetime = new Date(datetimeString);

  // Get the current offset in minutes
  const currentOffset = datetime.getTimezoneOffset();

  // Adjust the datetime to the target offset
  const localDatetime = new Date(
    datetime.getTime() - currentOffset * 60 * 1000
  );

  return localDatetime;
}

// Function to generate .ics file
function generateICS(data: eventInfo[]) {
  // Create a new calendar
  const cal = ical({ name: "Medication Reminders" });

  // Loop through the data to create events for each medication
  data.forEach((event: eventInfo) => {
    cal.createEvent({
      ...event,
      start: convertToLocalWithOffset(event.start),
      end: convertToLocalWithOffset(event.end),
      repeating: { freq: ICalEventRepeatingFreq.DAILY },
      alarms: [
        { type: ICalAlarmType.display, trigger: 60 * 60 }, // Display alarm 1 hour before event
      ],
    });
  });

  const fileContent = cal.toString();
  const blob = new Blob([fileContent], { type: "text/calendar" });
  const file = new File([blob], "medication_reminders.ics", {
    type: "text/calendar",
  });

  return file;
}

// Example data
const jsonData = [
  { eventName: "Aspirin", dosage: 1, timesPerDay: 3, beforeMeal: true },
  { eventName: "Ibuprofen", dosage: 2, timesPerDay: 2, beforeMeal: false },
];

const DownloadLink = ({ data }: { data: eventInfo[] }) => {
  const handleDownload = () => {
    const file = generateICS(data);

    // Create a URL for the File object
    const url = URL.createObjectURL(file);
    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.download = "medication_reminders.ics";

    // Simulate a click event on the anchor element
    document.body.appendChild(link); // Required for Firefox
    link.click();
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 2000); // Revoke URL after 2 seconds
  };

  return (
    <a href="#" onClick={handleDownload} color="blue">
      Link to Download Medication Reminders
    </a>
  );
};

export default DownloadLink;
