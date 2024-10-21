import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
} from "./validation";

export const validateLoginData = (loginData) => {
  const errors = {};
  // Validate email
  if (isBlank(loginData.email) || !isValidEmail(loginData.email)) {
    errors.email = "Please enter a valid email address";
  }
  // Validate password
  if (isBlank(loginData.password)) {
    errors.password = "Password cannot be empty";
  }

  return errors;
};

// validate email for forgot password form
export const validateEmail = (formData) => {
  const errors = {};

  if (isBlank(formData.email) || !isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
};

export const validateResetPassword = (formData, isEdit) => {
  const errors = {};

  if (isBlank(formData.email)) {
    errors.email = "Email cannot be empty";
  }
  if (!isBlank(formData.email) && !isValidEmail(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (isBlank(formData.otp)) {
    errors.otp = "OTP cannot be empty";
  }
  if (isBlank(formData.password)) {
    errors.password = "Password cannot be empty";
  }
  if (isBlank(formData.confirmPassword)) {
    errors.confirmPassword = "Password cannot be empty";
  }
  // more than 8 characters

  if (formData?.password?.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // not equal
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords don't match";
  }

  return errors;
};

export const validateAddCompany = (formData) => {
  const errors = {};
  if (isBlank(formData.nameEn)) {
    errors.nameEn = "Company Name Can not be empty";
  }
  if (isBlank(formData.nameAr)) {
    errors.nameAr = "Company Name Can not be empty";
  }

  if (isBlank(formData.mainPhone)) {
    errors.mainPhone = "Main phone can not be empty";
  }

  if (isBlank(formData.clientFlag)) {
    errors.clientFlag = "Company Type can not be empty";
  }

  if (!validatePhoneNumber(formData.mainPhone)) {
    errors.mainPhone = "Enter Valid Phone Number";
  }

  if (isBlank(formData.cityId)) {
    errors.cityId = "City can not be empty";
  }

  if (isBlank(formData.addressString)) {
    errors.addressString = "Address can not be empty";
  }

  //   if (isBlank(formData.notes)) {
  //     errors.notes = "Notes can not be empty";
  //   }

  // validate contacts
  if (formData?.contacts.length > 0) {
    if (hasEmptyKeys(formData.contacts, ["fullName", "phone"])) {
      errors.contacts =
        "Please complete the empty fields or remove any empty rows";
    }
  }

  return errors;
};

export const validateEditCompany = (formData) => {
  const errors = {};
  if (isBlank(formData.nameEn)) {
    errors.nameEn = "Company Name Can not be empty";
  }
  if (isBlank(formData.nameAr)) {
    errors.nameAr = "Company Name Can not be empty";
  }

  if (isBlank(formData.clientFlag)) {
    errors.clientFlag = "Company Type can not be empty";
  }

  if (isBlank(formData.mainPhone)) {
    errors.mainPhone = "Main phone can not be empty";
  }

  if (!validatePhoneNumber(formData.mainPhone)) {
    errors.mainPhone = "Enter Valid Phone Number";
  }

  return errors;
};

export const validateAddCourse = (formData) => {
  const errors = {};

  if (isBlank(formData?.branchId)) {
    errors.branchId = "Branch Can not be empty";
  }

  if (isBlank(formData.name_en)) {
    errors.name_en = "Course Name Can not be empty";
  }

  if (isBlank(formData.description_en)) {
    errors.description_en = "Description Can not be empty";
  }

  //   if (isBlank(formData.name_ar)) {
  //     errors.name_ar = "Course Name Can not be empty";
  //   }

  if (isBlank(formData.courseCode)) {
    errors.courseCode = "Course Code Can not be empty";
  }
  if (isBlank(formData.courseCategoryId)) {
    errors.courseCategoryId = "Course Category Can not be empty";
  }

  //subCourseCategoryId
  if (isBlank(formData.courseSubCategoryId)) {
    errors.courseSubCategoryId = "Course sub category Can not be empty";
  }

  if (isBlank(formData.courseTime)) {
    errors.courseTime = "Course Hours Can not be empty";
  }

  if (!isValidPositiveNumber(formData?.courseTime)) {
    errors.courseTime = "Please enter a valid number";
  }

  if (isBlank(formData.memberPrice)) {
    errors.memberPrice = "Memmber Price Can not be empty";
  }

  if (!isValidPositiveNumber(formData?.memberPrice)) {
    errors.memberPrice = "Please enter a valid number";
  }

  if (isBlank(formData.nonMemberPrice)) {
    errors.nonMemberPrice = "Non Memmber Can not be empty";
  }

  if (!isValidPositiveNumber(formData?.nonMemberPrice)) {
    errors.nonMemberPrice = "Please enter a valid number";
  }

  // validate extras
  if (formData?.extras.length > 0) {
    formData.extras.forEach((extra) => {
      if (!isValidPositiveNumber(extra?.price)) {
        errors.extras = "Please enter a valid price";
      }
    });
    if (hasEmptyKeys(formData.extras, ["extraName", "price"])) {
      errors.extras =
        "Please complete the empty fields or remove any empty rows";
    }
  }

  return errors;
};

export const validateEditCourse = (formData) => {
  const errors = {};

  if (isBlank(formData?.branchId)) {
    errors.branchId = "Branch Can not be empty";
  }
  if (isBlank(formData.name_en)) {
    errors.name_en = "Course Name Can not be empty";
  }

  //   if (isBlank(formData.name_ar)) {
  //     errors.name_ar = "Course Name Can not be empty";
  //   }
  if (isBlank(formData.description_en)) {
    errors.description_en = "Description Can not be empty";
  }
  if (isBlank(formData.courseCategoryId)) {
    errors.courseCategoryId = "Course Category Can not be empty";
  }

  //subCourseCategoryId
  if (isBlank(formData.courseSubCategoryId)) {
    errors.courseSubCategoryId = "Course sub category Can not be empty";
  }

  //   if (isBlank(formData.courseCode)) {
  //     errors.courseCode = "Course Code Can not be empty";
  //   }

  if (isBlank(formData.courseTime)) {
    errors.courseTime = "Course Hours Can not be empty";
  }

  if (isBlank(formData.memberPrice)) {
    errors.memberPrice = "Memmber Price Can not be empty";
  }

  if (isBlank(formData.nonMemberPrice)) {
    errors.nonMemberPrice = "Non Memmber Can not be empty";
  }

  if (!isValidPositiveNumber(formData?.courseTime)) {
    errors.courseTime = "Please enter a valid number";
  }

  if (!isValidPositiveNumber(formData?.memberPrice)) {
    errors.memberPrice = "Please enter a valid number";
  }

  if (!isValidPositiveNumber(formData?.nonMemberPrice)) {
    errors.nonMemberPrice = "Please enter a valid number";
  }

  // validate extras
  if (formData?.extras.length > 0) {
    formData.extras.forEach((extra) => {
      if (!isValidPositiveNumber(extra?.price)) {
        errors.extras = "Please enter a valid price";
      }
    });
    if (hasEmptyKeys(formData.extras, ["extraName", "price"])) {
      errors.extras =
        "Please complete the empty fields or remove any empty rows";
    }
  }

  return errors;
};

export const validateAddRoom = (formData) => {
  const errors = {};

  if (isBlank(formData?.branchId))
    errors.branchId = "Please fill the Branch field";

  if (isBlank(formData?.nameEn))
    errors.nameEn = "Please fill the Name (EN) field";

  if (isBlank(formData?.nameAr))
    errors.nameAr = "Please fill the Name (AR) field";

  if (isBlank(formData?.roomCode))
    errors.roomCode = "Please fill the Room Code field";

  if (isBlank(formData?.capacity))
    errors.capacity = "Please fill the Capacity field";

  // validate positive numbers
  if (!isValidPositiveNumber(formData?.capacity))
    errors.capacity = "Please enter a valid number";

  if (isBlank(formData?.descriptionEn))
    errors.descriptionEn = "Please fill the Description (EN) field";

  return errors;
};

export const validateAddCourseCategory = (formData, isSubCategory) => {
  const errors = {};

  if (isBlank(formData.name_ar)) {
    errors.name_ar = "Please fill the Name (AR) field";
  }

  if (isBlank(formData.name_en)) {
    errors.name_en = "Please fill the Name (EN) field";
  }
  if (isBlank(formData.branchId)) {
    errors.branchId = "Please fill the Branch field";
  }
  if (isBlank(formData.categoryCode)) {
    errors.categoryCode = "Please fill the Category Code field";
  }
  if (isBlank(formData.parentId) && isSubCategory) {
    errors.parentId = "Please fill the Main Category field";
  }

  return errors;
};

export const validateEditCourseCategory = (formData, isSubCategory) => {
  const errors = {};

  if (isBlank(formData.name_ar)) {
    errors.name_ar = "Please fill the Name (AR) field";
  }

  if (isBlank(formData.name_en)) {
    errors.name_en = "Please fill the Name (EN) field";
  }
  if (isBlank(formData.branchId)) {
    errors.branchId = "Please fill the Branch field";
  }

  if (isBlank(formData.parentId) && isSubCategory) {
    errors.parentId = "Please fill the Main Category field";
  }

  return errors;
};

export const validateAddInstructor = (formData) => {
  const errors = {};
  if (isBlank(formData?.name))
    errors.name = "Please Fill in the instructor's name";

  if (isBlank(formData?.jobTitle))
    errors.jobTitle = "Please Fill in the instructor's Job Title";

  if (!validatePhoneNumber(formData.phone)) {
    errors.phone = "Please Enter a Valid Phone Number";
  }
  if (!validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }

  if (isBlank(formData?.birthDate)) {
    errors.birthDate = "Please Fill in Birth Date";
  }

  if (isBlank(formData?.branchId))
    errors.branchId = "Please Provide the Branch";

  if (isBlank(formData?.courseId))
    errors.courseId = "Please fill in the course name";

  if (isBlank(formData?.govIssuedId))
    errors.govIssuedId = "Please Fill in the instructor's Gov Id";

  if (isBlank(formData.email) || !isValidEmail(formData.email))
    errors.email = "Please enter a valid email address";

  return errors;
};

export const validateEditInstuctor = (formData) => {
  const errors = {};
  if (isBlank(formData?.name))
    errors.name = "Please Fill in the instructor's name";

  if (isBlank(formData?.jobTitle))
    errors.jobTitle = "Please Fill in the instructor's Job Title";

  if (!validatePhoneNumber(formData.phone)) {
    errors.phone = "Please Enter a Valid Phone Number";
  }
  if (!validatePhoneNumber(formData.whatsappNum)) {
    errors.whatsappNum = "Please Enter a Valid Phone Number";
  }

  if (isBlank(formData?.birthDate)) {
    errors.birthDate = "Please Fill in Birth Date";
  }

  if (isBlank(formData?.branchId))
    errors.branchId = "Please Provide the Branch";

  if (isBlank(formData?.courseId))
    errors.courseId = "Please fill in the course name";

  if (isBlank(formData?.govIssuedId))
    errors.govIssuedId = "Please Fill in the instructor's Gov Id";

  if (isBlank(formData.email) || !isValidEmail(formData.email))
    errors.email = "Please enter a valid email address";

  return errors;
};

export const validateAddRound = (formData) => {
  const errors = {};
  return errors;
};

export const validateEditRound = (formData) => {
  const errors = {};
  return errors;
};
