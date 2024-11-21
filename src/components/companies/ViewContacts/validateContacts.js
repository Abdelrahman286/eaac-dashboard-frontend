import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "../../../utils/validation";

export const validateContacts = (formData) => {
  // name , what's m job title , branch
  const errors = {};
  if (isBlank(formData?.name)) {
    errors.name = "Please Fill in the Profile name";
  }

  if (isBlank(formData?.phoneNum1)) {
    errors.phoneNum1 = "Please Fill in Phone Number";
  }
  if (formData?.phoneNum1 && !validatePhoneNumber(formData.phoneNum1)) {
    errors.phoneNum1 = "Please Enter a Valid Phone Number";
  }

  if (formData?.whatsappNum && !validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }

  if (isBlank(formData?.email1)) {
    errors.email1 = "Please Fill in Email Field";
  }
  if (isBlank(formData?.jobTitle)) {
    errors.jobTitle = "Please Fill in the Job Title";
  }

  return errors;
};

export const validateEditContact = (formData) => {
  const errors = {};
  if (isBlank(formData?.name)) {
    errors.name = "Please Fill in the Profile name";
  }

  if (isBlank(formData?.phoneNum1)) {
    errors.phoneNum1 = "Please Fill in Phone Number";
  }
  if (formData?.phoneNum1 && !validatePhoneNumber(formData.phoneNum1)) {
    errors.phoneNum1 = "Please Enter a Valid Phone Number";
  }

  if (formData?.whatsappNum && !validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }

  if (isBlank(formData?.email1)) {
    errors.email1 = "Please Fill in Email Field";
  }
  if (isBlank(formData?.jobTitle)) {
    errors.jobTitle = "Please Fill in the Job Title";
  }

  return errors;
};
