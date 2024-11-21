import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "../../../utils/validation";

export const validateAddBranch = (formData) => {
  const errors = {};
  if (isBlank(formData?.nameAr)) {
    errors.nameAr = "Please Fill in the Branch name";
  }
  if (isBlank(formData?.nameEn)) {
    errors.nameEn = "Please Fill in the Branch name";
  }

  if (isBlank(formData?.branchCode)) {
    errors.branchCode = "Please Fill in the Branch Code";
  }

  if (formData?.mainPhone && !validatePhoneNumber(formData.mainPhone)) {
    errors.mainPhone = "Please Enter a Valid Phone Number";
  }

  return errors;
};

export const validateEditBranch = (formData) => {
  const errors = {};
  if (isBlank(formData?.nameAr)) {
    errors.nameAr = "Please Fill in the Branch name";
  }
  if (isBlank(formData?.nameEn)) {
    errors.nameEn = "Please Fill in the Branch name";
  }

  if (isBlank(formData?.branchCode)) {
    errors.branchCode = "Please Fill in the Branch Code";
  }

  if (formData?.mainPhone && !validatePhoneNumber(formData.mainPhone)) {
    errors.mainPhone = "Please Enter a Valid Phone Number";
  }

  return errors;
};
