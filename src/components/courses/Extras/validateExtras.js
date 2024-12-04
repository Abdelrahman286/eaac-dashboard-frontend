import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "../../../utils/validation";

export const validateAdd = (formData) => {
  // name , what's m job title , branch
  const errors = {};
  if (isBlank(formData?.name_en)) {
    errors.name_en = "Please Fill in the Extra name";
  }

  if (isBlank(formData?.memberPrice)) {
    errors.memberPrice = "Please Fill in the Extra price";
  }

  if (
    !isBlank(formData?.memberPrice) &&
    !isValidPositiveNumber(formData?.memberPrice)
  ) {
    errors.memberPrice = "Please enter a valid price";
  }

  // non meber price
  if (isBlank(formData?.nonMemberPrice)) {
    errors.nonMemberPrice = "Please Fill in the Extra price";
  }

  if (
    !isBlank(formData?.nonMemberPrice) &&
    !isValidPositiveNumber(formData?.nonMemberPrice)
  ) {
    errors.nonMemberPrice = "Please enter a valid price";
  }

  return errors;
};

export const validateEdit = (formData) => {
  // name , what's m job title , branch
  const errors = {};
  if (isBlank(formData?.name_en)) {
    errors.name_en = "Please Fill in the Extra name";
  }

  if (isBlank(formData?.memberPrice)) {
    errors.memberPrice = "Please Fill in the Extra price";
  }

  if (
    !isBlank(formData?.memberPrice) &&
    !isValidPositiveNumber(formData?.memberPrice)
  ) {
    errors.memberPrice = "Please enter a valid price";
  }

  // non meber price
  if (isBlank(formData?.nonMemberPrice)) {
    errors.nonMemberPrice = "Please Fill in the Extra price";
  }

  if (
    !isBlank(formData?.nonMemberPrice) &&
    !isValidPositiveNumber(formData?.nonMemberPrice)
  ) {
    errors.nonMemberPrice = "Please enter a valid price";
  }

  return errors;
};
