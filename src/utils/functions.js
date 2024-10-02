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
