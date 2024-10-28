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
  // Check if the input dateString is in the correct format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    throw new Error("Input date must be in YYYY-MM-DD format");
  }

  // Replace dashes with slashes
  return dateString.replace(/-/g, "/");
}

export const convertDateFormat = (dateString) => {
  if (!dateString) return;
  return dayjs(dateString).format("DD/MM/YYYY"); // Convert to dd/mm/yyyy
};

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
