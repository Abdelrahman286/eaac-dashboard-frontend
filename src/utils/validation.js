export const isBlank = (text) => {
  if (text === undefined || text === null || text === "") return true;
  return !String(text).trim();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  // Remove any spaces, dashes, parentheses, or other non-numeric characters
  if (!phoneNumber) return;
  const cleaned = phoneNumber.replace(/[^0-9+]/g, "");

  // Regular expression to validate phone numbers:
  // - Optional "+" followed by digits (for international numbers)
  // - Allows a minimum of 10 digits (common length for most phone numbers)
  const phoneRegex = /^(\+?\d{1,4})?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  return phoneRegex.test(cleaned);
};

export const hasEmptyKeys = (contacts, keyNames) => {
  // Loop through each contact in the array
  for (const contact of contacts) {
    // Loop through each keyName in the keyNames array
    for (const key of keyNames) {
      // Check if the key exists in the object and if its value is empty (null, undefined, or empty string)
      if (
        contact.hasOwnProperty(key) &&
        (contact[key] === "" ||
          contact[key] === null ||
          contact[key] === undefined)
      ) {
        return true; // Return true as soon as we find an empty value for any key
      }
    }
  }
  return false; // Return false if no empty values are found
};

export function isValidPositiveNumber(input) {
  // Parse the input to a number
  const parsedNumber = Number(input);

  // Check if the parsed number is a valid number and positive
  return (
    parsedNumber > 0 && !isNaN(parsedNumber) && !input.toString().includes("e")
  );
}
