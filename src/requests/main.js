export const URL = "https://erp.eaacgroup.org/api";

export const makeRequest = async (
  url,
  reqBody,
  token,
  config = {
    isFormData: true,
    urlParams: "",
  }
) => {
  // Construct the full URL by appending urlParams if they exist
  const fullUrl = config?.urlParams ? `${url}?${config.urlParams}` : url;

  let requestOptions = {
    method: "POST",
    headers: {},
    body: null,
  };

  // If isFormData is true, convert the request body to FormData
  if (config?.isFormData) {
    const formData = new FormData();

    // Helper function to append array of objects in the form of name[0][0]: 'mark'
    const appendNestedObjects = (data, parentKey) => {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (
            typeof item === "object" &&
            item !== null &&
            !(item instanceof File)
          ) {
            // Iterate over object properties in each array item
            Object.keys(item).forEach((key, subIndex) => {
              formData.append(`${parentKey}[${index}][${subIndex}]`, item[key]);
            });
          } else if (item instanceof File) {
            // File type element

            if (index == 0) {
              formData.append(`${parentKey}`, item);
            } else {
              formData.append(`${parentKey}${index}`, item);
            }
          } else {
            formData.append(`${parentKey}[]`, item); // For primitive arrays
          }
        });
      } else if (typeof data === "object" && data !== null) {
        // Handle nested objects
        Object.keys(data).forEach((key) => {
          appendNestedObjects(data[key], `${parentKey}[${key}]`);
        });
      } else {
        // Append primitive types without adding []

        formData.append(parentKey, data);
      }
    };

    // Handle `reqBody` properties
    Object.keys(reqBody).forEach((key) => {
      const value = reqBody[key];

      if (Array.isArray(value)) {
        // Handle arrays (including array of objects)
        appendNestedObjects(value, key);
      } else if (typeof value === "object" && value !== null) {
        // Handle nested objects
        appendNestedObjects(value, key);
      } else {
        // Handle primitive values (without adding [])
        formData.append(key, value); // Primitive values do not get []
      }
    });

    requestOptions.body = formData;

    // Debug formData
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
  } else {
    // Otherwise, send the request body as JSON
    requestOptions.body = JSON.stringify(reqBody);
  }

  // If token exists, add Authorization and X-Security-Key headers
  if (token) {
    requestOptions.headers["Authorization"] = `Bearer ${token}`;
    requestOptions.headers["Access-Control-Allow-Origin"] = true;
    requestOptions.headers["X-Security-Key"] = "66d5b04289662"; // Add the custom header
  }

  try {
    // Enable/disable requests
    const response = await fetch(fullUrl, requestOptions);

    // if (!response.ok) {
    //   const errorData = await response.json();
    //   throw new Error(
    //     errorData.message || `Request failed with status ${response.status}`,
    //     errorData.code || `${response.status}`
    //   );
    // }

    if (!response.ok) {
      const errorData = await response.json();

      const validationErrorMessages = errorData?.failed?.response?.errors;
      const combinedErrorMsgs = Object.values(validationErrorMessages).join(
        ", "
      );

      const errorMsg =
        `${errorData?.failed?.response?.msg} , ${combinedErrorMsgs}` ||
        "Something went wrong. Please try again!";

      // Create a new error object and manually assign properties
      const error = new Error(errorMsg); // You can also pass the message here

      throw error;
    }
    return response.json();
  } catch (error) {
    throw new Error(error.message || "Network error");
  }
};
