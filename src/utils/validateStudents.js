import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "./validation";

export const validateAddStudent = (formData) => {
  const errors = {};
  if (isBlank(formData?.name))
    errors.name = "Please Fill in the instructor's name";

  if (!validatePhoneNumber(formData.phone)) {
    errors.phone = "Please Enter a Valid Phone Number";
  }
  if (!validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }
  if (isBlank(formData?.birthDate)) {
    errors.birthDate = "Please Fill in Birth Date";
  }
  if (isFutureDate(formData?.birthDate)) {
    errors.birthDate = "Birth Date Can not be in the future";
  }

  if (isBlank(formData?.branchId))
    errors.branchId = "Please Provide the Branch";

  if (isBlank(formData?.govIssuedId))
    errors.govIssuedId = "Please Fill in the instructor's Gov Id";

  if (isBlank(formData.email) || !isValidEmail(formData.email))
    errors.email = "Please enter a valid email address";

  return errors;
};

export const validateEditStudent = (formData) => {
  const errors = {};
  if (isBlank(formData?.name))
    errors.name = "Please Fill in the instructor's name";

  if (!validatePhoneNumber(formData.phone)) {
    errors.phone = "Please Enter a Valid Phone Number";
  }
  if (!validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }
  if (isBlank(formData?.birthDate)) {
    errors.birthDate = "Please Fill in Birth Date";
  }
  if (isFutureDate(formData?.birthDate)) {
    errors.birthDate = "Birth Date Can not be in the future";
  }

  if (isBlank(formData?.branchId))
    errors.branchId = "Please Provide the Branch";

  if (isBlank(formData?.govIssuedId))
    errors.govIssuedId = "Please Fill in the instructor's Gov Id";

  if (isBlank(formData.email) || !isValidEmail(formData.email))
    errors.email = "Please enter a valid email address";

  return errors;
};

export const validateEnroll = (group, paymentMethod, deposit) => {
  const errors = {};

  if (!group) {
    errors.group = "Please Select Group";
  }

  if (!paymentMethod) {
    errors.paymentMethod = "Please Select Payment Method";
  }

  if (isBlank(deposit)) {
    errors.deposit = "Please fill in deposit value";
  }

  return errors;
};
