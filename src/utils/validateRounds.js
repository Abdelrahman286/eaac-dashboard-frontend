import {
  isBlank,
  isValidEmail,
  validatePhoneNumber,
  hasEmptyKeys,
  isValidPositiveNumber,
} from "./validation";

import { isSecondTimeLessThanFirst, isSecondDateGreater } from "./functions";

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

  // valdidate time difference
  if (
    !isBlank(dataRow?.sessionStartTime) &&
    !isBlank(dataRow?.sessionEndTime) &&
    isSecondTimeLessThanFirst(
      dataRow?.sessionStartTime,
      dataRow?.sessionEndTime
    )
  ) {
    errors.sessionEndTime = "The End Time Must Be After the Start Time";
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

  // valdidate time difference
  if (
    !isBlank(formData?.sessionStartTime) &&
    !isBlank(formData?.sessionEndTime) &&
    isSecondTimeLessThanFirst(
      formData?.sessionStartTime,
      formData?.sessionEndTime
    )
  ) {
    errors.sessionEndTime = "The End Time Must Be After the Start Time";
  }

  if (isBlank(formData?.startDate))
    errors.startDate = "Please Fill in Start Date";

  if (isBlank(formData?.endDate))
    errors.endDate = "Please Fill in Session End Date";

  // validate date difference

  if (
    !isBlank(formData?.startDate) &&
    !isBlank(formData?.endDate) &&
    !isSecondDateGreater(formData?.startDate, formData?.endDate)
  ) {
    errors.endDate = "Session End Date Must be after the Start Date";
  }

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

  // valdidate time difference
  if (
    !isBlank(dataRow?.startTime) &&
    !isBlank(dataRow?.endTime) &&
    isSecondTimeLessThanFirst(dataRow?.startTime, dataRow?.endTime)
  ) {
    errors.endTime = "The End Time Must Be After the Start Time";
  }

  if (isBlank(dataRow?.instructorId)) {
    errors.instructorId = "Please Select Session Instructor";
  }

  return errors;
};

export const validateAddBulkInEdit = (dataRow) => {
  const errors = {};

  if (isBlank(dataRow?.sessionNameDynamic)) {
    errors.sessionNameDynamic = "Please Fill in Session Name";
  }
  if (isBlank(dataRow?.roomId)) {
    errors.roomId = "Please Select Session Room ";
  }

  if (isBlank(dataRow?.startDate)) {
    errors.startDate = "Please Fill in start Session Date";
  }

  if (isBlank(dataRow?.endDate)) {
    errors.endDate = "Please Fill in End Session Date";
  }

  // validate date difference
  if (
    !isBlank(dataRow?.startDate) &&
    !isBlank(dataRow?.endDate) &&
    !isSecondDateGreater(dataRow?.startDate, dataRow?.endDate)
  ) {
    errors.endDate = "Session End Date Must be after the Start Date";
  }

  if (isBlank(dataRow?.sessionStartTime)) {
    errors.sessionStartTime = "Please Fill in Session Start Time";
  }

  if (isBlank(dataRow?.sessionEndTime)) {
    errors.sessionEndTime = "Please Fill in Session End Time";
  }

  // validate time difference
  if (
    !isBlank(dataRow?.sessionStartTime) &&
    !isBlank(dataRow?.sessionEndTime) &&
    isSecondTimeLessThanFirst(
      dataRow?.sessionStartTime,
      dataRow?.sessionEndTime
    )
  ) {
    errors.sessionEndTime = "The End Time Must Be After the Start Time";
  }

  if (isBlank(dataRow?.instructorId)) {
    errors.instructorId = "Please Select Session Instructor";
  }

  //weekDays
  if (isBlank(dataRow?.weekDays) || dataRow.weekDays?.length == 0) {
    errors.weekDays = "Please Select Week Days";
  }

  return errors;
};
