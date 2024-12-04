import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
  isFutureDate,
} from "../../utils/validation";

export const validateAdd = (formData) => {
  const errors = {};
  if (isBlank(formData?.name))
    errors.name = "Please Fill in the instructor's name";

  if (!validatePhoneNumber(formData?.phone)) {
    errors.phone = "Please Enter a Valid Phone Number";
  }
  if (!validatePhoneNumber(formData?.whatsappNum)) {
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

  if (isBlank(formData?.email) || !isValidEmail(formData?.email))
    errors.email = "Please enter a valid email address";

  if (isBlank(formData?.password))
    errors.password = "Please fill in password field";

  if (!isBlank(formData?.password) && formData?.password?.length <= 8)
    errors.password = "Password Must contain more than 8 characters";

  if (isBlank(formData?.confirmPassword))
    errors.confirmPassword = "Please fill in confirm password field";

  // password & confirm passowrd aren't equal
  if (
    !isBlank(formData?.password) &&
    !isBlank(formData?.confirmPassword) &&
    formData?.password !== formData?.confirmPassword
  ) {
    errors.confirmPassword = "Confirm Password Field is different";
  }

  return errors;
};

export const validateEdit = (formData) => {
  const errors = {};
  if (isBlank(formData?.name))
    errors.name = "Please Fill in the instructor's name";

  if (!validatePhoneNumber(formData?.phone)) {
    errors.phone = "Please Enter a Valid Phone Number";
  }
  if (!validatePhoneNumber(formData?.whatsappNum)) {
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

  if (isBlank(formData?.email) || !isValidEmail(formData?.email))
    errors.email = "Please enter a valid email address";

  if (!isBlank(formData?.password) && formData?.password?.length <= 8)
    errors.password = "Password Must contain more than 8 characters";

  // password & confirm passowrd aren't equal
  if (
    !isBlank(formData?.password) &&
    !isBlank(formData?.confirmPassword) &&
    formData?.password !== formData?.confirmPassword
  ) {
    errors.confirmPassword = "Confirm Password Field is different";
  }

  return errors;
};
