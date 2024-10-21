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
