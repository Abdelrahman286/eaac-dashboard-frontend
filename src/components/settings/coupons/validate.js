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

  if (isBlank(formData?.voucherName)) {
    errors.voucherName = "Please fill in Voucher Name";
  }

  if (isBlank(formData?.validTo)) {
    errors.validTo = "Please fill in date";
  }

  if (!isBlank(formData?.validTo) && !isFutureDate(formData?.validTo)) {
    errors.validTo = "Valid Date can't be in the past";
  }

  if (isBlank(formData?.voucherCode)) {
    errors.voucherCode = "Please fill promo code";
  }
  if (isBlank(formData?.discountPercentage)) {
    errors.discountPercentage = "Please fill in this field";
  }

  return errors;
};
