import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "../../../utils/validation";

export const validateAdd = (formData) => {
  const errors = {};

  if (isBlank(formData?.nameAr)) {
    errors.nameAr = "Please fill in Payment Method Name";
  }

  if (isBlank(formData?.nameEn)) {
    errors.nameEn = "Please fill in Payment Method Name";
  }

  if (isBlank(formData?.branchId)) {
    errors.branchId = "Please select Branch";
  }

  return errors;
};
