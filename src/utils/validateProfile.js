import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "./validation";

export const validateEditProfile = (formData) => {
  // name , what's m job title , branch
  const errors = {};
  if (isBlank(formData?.name)) {
    errors.name = "Please Fill in the Profile name";
  }

  if (isBlank(formData?.whatsappNum)) {
    errors.whatsappNum = "Please Fill in What's App Number";
  }

  if (formData?.whatsappNum && !validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }
  if (isBlank(formData?.jobTitle)) {
    errors.jobTitle = "Please Fill in the Job Title";
  }
  if (isBlank(formData?.branchId)) {
    errors.branchId = "Please Select The Branch";
  }

  return errors;
};
