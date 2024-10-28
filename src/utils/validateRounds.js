import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
} from "./validation";

export const validateRoundRow = (dataRow) => {
  const errors = {};

  if (isBlank(dataRow?.sessionName)) {
    errors.sessionName = "Please Fill in Session Name";
  }
  if (isBlank(dataRow?.sessionRoomId)) {
    errors.sessionRoomId = "Please Select Session Room ";
  }

  if (isBlank(dataRow?.sessionDate)) {
    errors.sessionDate = "Please Fill in Session Date";
  }

  if (isBlank(dataRow?.sessionStartTime)) {
    errors.sessionStartTime = "Please Fill in Session Start Time";
  }

  if (isBlank(dataRow?.sessionEndTime)) {
    errors.sessionEndTime = "Please Fill in Session End Time";
  }

  if (isBlank(dataRow?.instructorId)) {
    errors.instructorId = "Please Select Session Instructor";
  }

  return errors;
};

export const validateBulkSuggestion = (formData) => {
  const errors = {};

  if (isBlank(formData?.sessionNameDynamic))
    errors.sessionNameDynamic = "Please Fill in Session Name";

  if (isBlank(formData?.sessionStartTime))
    errors.sessionStartTime = "Please Fill in Session Start Time";

  if (isBlank(formData?.sessionEndTime))
    errors.sessionEndTime = "Please Fill in Session End Time";

  if (isBlank(formData?.startDate))
    errors.startDate = "Please Fill in Start Date";

  if (isBlank(formData?.endDate))
    errors.endDate = "Please Fill in Session End Date";

  //   if (formData?.weekDays) errors.weekDays = "Please Select Session Days";
  if (!formData?.weekDays) {
    errors.weekDays = "Please Select Session Days";
  }

  return errors;
};

export const validateEditSession = (dataRow) => {
  const errors = {};

  if (isBlank(dataRow?.nameEn)) {
    errors.nameEn = "Please Fill in Session Name";
  }
  if (isBlank(dataRow?.roomId)) {
    errors.roomId = "Please Select Session Room ";
  }

  if (isBlank(dataRow?.sessionDate)) {
    errors.sessionDate = "Please Fill in Session Date";
  }

  if (isBlank(dataRow?.startTime)) {
    errors.startTime = "Please Fill in Session Start Time";
  }

  if (isBlank(dataRow?.endTime)) {
    errors.endTime = "Please Fill in Session End Time";
  }

  if (isBlank(dataRow?.instructorId)) {
    errors.instructorId = "Please Select Session Instructor";
  }

  return errors;
};
