import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
  isDateInThePast,
} from "../../utils/validation";

export const validateAddMembership = (formData) => {
  const errors = {};

  if (isBlank(formData?.clientId)) {
    errors.clientId = "Please select the required student";
  }

  if (isBlank(formData?.membershipTypeId)) {
    errors.membershipTypeId = "Please select Membership Type";
  }

  if (isBlank(formData?.membershipCode)) {
    errors.membershipCode = "Please fill in Membership Code";
  }

  if (isBlank(formData?.startDate)) {
    errors.startDate = "Please fill in Start Date";
  }

  //   if (!isBlank(formData?.startDate) && isDateInThePast(formData?.startDate)) {
  //     errors.startDate = "Start Date Can't be in the past";
  //   }

  if (isBlank(formData?.image)) {
    errors.image = "Please Add Client Image";
  }

  if (
    !isBlank(formData?.image[0]) &&
    !formData?.image[0]?.type?.startsWith("image")
  ) {
    errors.image = "Invalid Image Format";
  }

  if (isBlank(formData?.fee)) {
    errors.fee = "Please fill in membership fee";
  }

  if (isBlank(formData?.paymentMethodId)) {
    errors.paymentMethodId = "Please Select Payment Method";
  }

  return errors;
};

export const validateRenew = (formData) => {
  const errors = {};

  if (isBlank(formData?.clientId)) {
    errors.clientId = "Please select the required student";
  }

  if (isBlank(formData?.membershipTypeId)) {
    errors.membershipTypeId = "Please select Membership Type";
  }

  if (isBlank(formData?.membershipCode)) {
    errors.membershipCode = "Please fill in Membership Code";
  }

  if (isBlank(formData?.startDate)) {
    errors.startDate = "Please fill in Start Date";
  }

  //   if (!isBlank(formData?.startDate) && isDateInThePast(formData?.startDate)) {
  //     errors.startDate = "Start Date Can't be in the past";
  //   }

  if (
    !isBlank(formData?.image[0]) &&
    !formData?.image[0]?.type?.startsWith("image")
  ) {
    errors.image = "Invalid Image Format";
  }

  if (isBlank(formData?.fee)) {
    errors.fee = "Please fill in membership fee";
  }

  if (isBlank(formData?.paymentMethodId)) {
    errors.paymentMethodId = "Please Select Payment Method";
  }

  return errors;
};

// validate Edit
export const validateEdit = (formData) => {
  const errors = {};

  if (isBlank(formData?.membershipTypeId)) {
    errors.membershipTypeId = "Please select Membership Type";
  }

  if (isBlank(formData?.membershipCode)) {
    errors.membershipCode = "Please fill in Membership Code";
  }

  if (isBlank(formData?.startAt)) {
    errors.startAt = "Please fill in Start Date";
  }

  //   if (!isBlank(formData?.startAt) && isDateInThePast(formData?.startAt)) {
  //     errors.startAt = "Start Date Can't be in the past";
  //   }
  // card status cardStatusId
  if (isBlank(formData?.cardStatusId)) {
    errors.cardStatusId = "Please select card status";
  }

  return errors;
};
