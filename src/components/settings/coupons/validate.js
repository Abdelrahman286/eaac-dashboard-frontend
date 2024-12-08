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

  if (isBlank(formData?.voucherCode)) {
    errors.voucherCode = "Please fill promo code";
  }
  if (isBlank(formData?.discountPercentage)) {
    errors.discountPercentage = "Please fill in this field";
  }

  return errors;
};
