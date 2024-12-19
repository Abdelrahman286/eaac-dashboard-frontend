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

  if (isBlank(formData?.expenseId)) {
    errors.expenseId = "Please Select Expenses Type";
  }

  //   if (isBlank(formData?.companyId)) {
  //     errors.companyId = "Please Select Vendor";
  //   }

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

export const validateReconcile = (formData) => {
  const errors = {};

  // add vendorId

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
