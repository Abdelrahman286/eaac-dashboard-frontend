import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "../../../utils/validation";

export const validateAddPayment = (formData) => {
  const errors = {};

  if (isBlank(formData?.clientId)) {
    errors.clientId = "Please Select Student";
  }

  if (isBlank(formData?.roundId)) {
    errors.roundId = "Please Select Round";
  }

  if (isBlank(formData?.paymentMethodId)) {
    errors.paymentMethodId = "Please Select Payment Method";
  }

  if (isBlank(formData?.paymentAmount)) {
    errors.paymentAmount = "Please fill in Payment Amount";
  }

  if (
    !isBlank(formData?.paymentAmount) &&
    !isValidPositiveNumber(formData?.paymentAmount)
  ) {
    errors.paymentAmount = "Please fill in Payment Amount";
  }

  return errors;
};
