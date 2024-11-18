import dayjs from "dayjs"; // To help with formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
export function createImageFileFromUrl(imageUrl, fileName) {
  // Fetch the image from the URL
  fetch(imageUrl)
    .then((response) => response.blob()) // Convert the response to a blob
    .then((blob) => {
      // Create a URL for the blob object
      const imageBlobUrl = URL.createObjectURL(blob);

      // Create a new anchor element for downloading the image
      const a = document.createElement("a");
      a.href = imageBlobUrl;
      a.download = fileName || "downloaded-image.png"; // Set the file name for download

      // Append the anchor to the document and trigger the download
      document.body.appendChild(a);
      a.click();

      // Clean up by revoking the object URL and removing the anchor
      URL.revokeObjectURL(imageBlobUrl);
      a.remove();
    })
    .catch((err) => {
      console.error("Error fetching or processing image:", err);
    });
}

export function convertDateFromDashToSlash(dateString) {
  if (!dateString) return;

  const dashRegex = /^\d{4}-\d{2}-\d{2}$/;
  const slashRegex = /^\d{4}\/\d{2}\/\d{2}$/;

  if (slashRegex.test(dateString)) {
    return dateString; // Return as-is if already in YYYY/MM/DD format
  }

  if (!dashRegex.test(dateString)) {
    throw new Error("Input date must be in YYYY-MM-DD or YYYY/MM/DD format");
  }

  // Replace dashes with slashes
  return dateString.replace(/-/g, "/");
}

export const convertDateFormat = (dateString) => {
  if (!dateString) return;
  return dayjs(dateString).format("DD/MM/YYYY"); // Convert to dd/mm/yyyy
};

// dd/mm/yyyy to yyyy-mm-dd
export function convertDateFormatStudent(dateString) {
  if (!dateString) return;
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

export function convertTo12HourFormat(time24) {
  const [hours, minutes, seconds] = time24.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight and 12+ hour to PM

  return `${hours12}:${minutes}:${seconds} ${period}`;
}

// from 2024-5-20 to 20 may 2024
export function formatDate(dateString) {
  const date = new Date(dateString);

  // Define options for toLocaleDateString
  const options = { day: "numeric", month: "long", year: "numeric" };

  // Convert to desired format
  return date.toLocaleDateString("en-US", options);
}

// from javascript date to dd/mm/yyyy
export const formatDate2 = (date) => {
  if (!date) return "No valid date";
  const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
  const year = date.getFullYear(); // Get full year
  return `${day}/${month}/${year}`; // Return formatted date
};

export function ensureSecondsInTime(timeString) {
  if (!timeString) return;

  // Check if the time already has seconds (e.g., H:mm:ss or HH:mm:ss)
  const timeWithSecondsRegex = /^\d{1,2}:\d{2}:\d{2}$/;
  if (timeWithSecondsRegex.test(timeString)) {
    return timeString; // Return as-is if it already includes seconds
  }

  // Check if the time is in H:mm or HH:mm format
  const timeWithoutSecondsRegex = /^\d{1,2}:\d{2}$/;
  if (timeWithoutSecondsRegex.test(timeString)) {
    return `${timeString}:00`; // Append ":00" if it has no seconds
  }

  throw new Error(
    "Input time must be in H:mm, HH:mm, H:mm:ss, or HH:mm:ss format"
  );
}

export const getConflictString = (conflictsArray) => {
  if (!Array.isArray(conflictsArray) || conflictsArray.length === 0) {
    return ""; // Return empty string if input is not an array or is empty
  }

  let combinedConflictString = "";

  conflictsArray.forEach((ele) => {
    const sessionDate = ele?.SessionDate.split(" ")[0];
    const startTime = convertTo12HourFormat(ele?.StartTime.split(" ")[1]);
    const endTime = convertTo12HourFormat(ele?.EndTime.split(" ")[1]);

    const roomConflict = ele?.Conflicts?.Room?.Name_en
      ? `Room: (${ele.Conflicts.Room.Name_en} - ${ele.Conflicts.Room.RoomCode})`
      : "";
    const instructorConflict = ele?.Conflicts?.Instructor?.Name
      ? `Instructor: ${ele.Conflicts.Instructor.Name}`
      : "";

    // Combine room and instructor conflicts with "&" if both exist
    const conflictString =
      roomConflict && instructorConflict
        ? `${roomConflict} & ${instructorConflict}`
        : `${roomConflict}${instructorConflict}`;

    combinedConflictString += `At (${sessionDate}) from (${startTime}) to (${endTime}) at ${conflictString}\n\n`;
  });

  return combinedConflictString;
};

export function isSecondTimeLessThanFirst(firstTime, secondTime) {
  // Helper function to convert time string to total minutes
  const timeToMinutes = (time) => {
    // Split by colon and parse the components
    const timeParts = time.split(":").map(Number);
    const hours = timeParts[0];
    const minutes = timeParts[1] || 0; // Default to 0 if minutes are not provided

    return hours * 60 + minutes;
  };

  // Convert both times to minutes
  const firstTimeMinutes = timeToMinutes(firstTime);
  const secondTimeMinutes = timeToMinutes(secondTime);

  // Return true if the second time is less than the first time
  return secondTimeMinutes < firstTimeMinutes;
}

export function isSecondDateGreater(firstDate, secondDate) {
  // Parse the dates to Date objects
  const date1 = new Date(firstDate);
  const date2 = new Date(secondDate);

  // Return true if second date is strictly greater, otherwise false
  return date2 > date1;
}

export function generateRandomNumber() {
  let result = "";
  for (let i = 0; i < 8; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Generate a random digit from 0 to 9
    result += randomDigit;
  }
  return result;
}
