import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import CourseExtras from "./CourseExtras";
import FormButton from "../FormButton";
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
import {
  editCourseFn,
  createCourseFn,
  getBranchesFn,
  getCategoriesFn,
} from "../../requests/courses";

import {
  validateAddCourse,
  validateEditCourse,
} from "../../utils/requestValidations";
import { getDataForTableRows } from "../../utils/tables";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const [courseExtras, setCourseExtras] = useState([]);
  const [editedCourseExtras, setEditedExtras] = useState([]);
  const [mainCatId, setMainCatId] = useState(null);

  // --------- request data for dropdowns -----------

  // branches
  const { data: branchesList, isLoading: branchesLoading } = useQuery({
    queryFn: () => {
      return getBranchesFn(
        {
          numOfElements: "2000",
          //   companyId: "1",
        },
        token
      );
    },

    queryKey: ["branches"],
  });
  const branches = getDataForTableRows(branchesList?.success?.response?.data);

  // request main categories
  const { data: mainCategoriesList, isLoading: mainCategoriesLoading } =
    useQuery({
      queryFn: () => {
        return getCategoriesFn(
          {
            numOfElements: "2000",
            main: "1",
          },
          token
        );
      },

      queryKey: ["main-categories"],
    });
  const mainCategories = getDataForTableRows(
    mainCategoriesList?.success?.response?.data
  );

  // request sub category

  const { data: subCategoriesList, isLoading: subCategoriesLoading } = useQuery(
    {
      queryFn: () => {
        return getCategoriesFn(
          {
            numOfElements: "2000",
            sub: `${mainCatId}`,
          },
          token
        );
      },
      enabled: !!mainCatId,
      retry: 2, // Number of retries
      queryKey: ["sub-categories", mainCatId],
    }
  );
  const subCategories = getDataForTableRows(
    subCategoriesList?.success?.response?.data
  );

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleCourseExtrasChange = (data) => {
    const newUpdatedData = data.map(({ id, ...rest }) => rest);
    setCourseExtras(newUpdatedData);
  };

  useEffect(() => {
    setFormData({ ...formData, extras: courseExtras });
  }, [courseExtras]);

  // send course data
  const {
    mutate: sendCourseData,
    isPending: addCourseLoading,
    isError: isAddCourseError,
    error: addCourseError,
  } = useMutation({
    mutationFn: createCourseFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["course-pagination"]);
      queryClient.invalidateQueries(["course-list"]);
      showSnackbar("Course Added Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at adding new Course", error);
      showSnackbar("Failed to Add new course data", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateAddCourse(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendCourseData({
        reqBody: formData,
        token,
      });
    }
  };

  useEffect(() => {
    if (!isEditData || !data) return;
    // Handle edit data initialization

    // Name_en , Description_en , ExtraType , MemberPrice
    const rawFormData = {
      id: [data.id],
      name_ar: data?.Name_ar || "",
      name_en: data?.Name_en || "",
      courseCode: data.CourseCode || "",
      courseTime: data.CourseTime || "",
      description_en: data.Description_en || "",
      memberPrice: data.MemberPrice || "",
      nonMemberPrice: data.NonMemberPrice || "",
      branchId: data.BranchID?.id || "",
      courseCategoryId: data?.CourseCategoryID?.id || "",
      courseSubCategoryId: data?.SubCategoryID?.id || "",
    };

    setMainCatId(data?.CourseCategoryID?.id);

    // handle course extra
    const newCourseExtra = data?.Extra.map((ele, index) => {
      return {
        id: index,
        extraName: ele?.Name_en || "",
        description: ele?.Description_en || "",
        type: ele?.ExtraType || "",
        price: ele?.MemberPrice || "",
      };
    });
    setEditedExtras(newCourseExtra);

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editCourse,
    isPending: editCourseLoading,
    isError: isEditError,
    error: editCourseError,
  } = useMutation({
    mutationFn: editCourseFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["course-pagination"]);
      queryClient.invalidateQueries(["course-list"]);
      showSnackbar("Course is Edited Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at editing Course data", error);
      showSnackbar("Failed to edit course data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const errors = validateEditCourse(formData);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editCourse({
        reqBody: formData,
        token,
      });
    }
  };

  // for DEBUG
  useEffect(() => {
    // console.log(formData);
  }, [formData]);

  return (
    <div className="course-form-page">
      <form>
        <div className="course-form">
          <Box display="flex" flexDirection="row" p={2} gap={2}>
            {/* Left Side */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              {/* Autocomplete for Branches */}
              <Autocomplete
                onChange={(e, value) => {
                  setFormData({ ...formData, branchId: value?.id });
                }}
                value={
                  branches.find((branch) => branch.id === formData.branchId) ||
                  null
                }
                options={branches}
                loading={branchesLoading}
                getOptionLabel={(option) => option?.Name_en}
                renderInput={(params) => (
                  <TextField
                    id="branchId"
                    error={Boolean(formErrors?.branchId)}
                    helperText={formErrors?.branchId}
                    {...params}
                    label="Branch *"
                    autoComplete="off"
                    autoCorrect="off"
                  />
                )}
              />
              {/* Autocomplete for Categories */}
              <Autocomplete
                onChange={(e, value) => {
                  setMainCatId(value?.id);
                  setFormData({ ...formData, courseCategoryId: value?.id });
                }}
                value={
                  mainCategories.find(
                    (item) => item.id == formData.courseCategoryId
                  ) || null
                }
                options={mainCategories}
                loading={mainCategoriesLoading}
                getOptionLabel={(option) => option?.Name_en}
                renderInput={(params) => (
                  <TextField
                    autoComplete="off"
                    autoCorrect="off"
                    id="courseCategoryId"
                    error={Boolean(formErrors?.courseCategoryId)}
                    helperText={formErrors?.courseCategoryId}
                    {...params}
                    label="Category *"
                  />
                )}
              />
              {/* Autocomplete for Sub Categories */}
              <Autocomplete
                onChange={(e, value) => {
                  setFormData({ ...formData, courseSubCategoryId: value?.id });
                }}
                value={
                  subCategories.find(
                    (item) => item.id === formData.courseSubCategoryId
                  ) || null
                }
                options={subCategories}
                loading={subCategoriesLoading}
                getOptionLabel={(option) => option?.Name_en}
                renderInput={(params) => (
                  <TextField
                    id="courseSubCategoryId"
                    error={Boolean(formErrors?.courseSubCategoryId)}
                    helperText={formErrors?.courseSubCategoryId}
                    autoComplete="off"
                    autoCorrect="off"
                    {...params}
                    label="Sub Category *"
                  />
                )}
              />
              {/* Input Field for Course Name */}

              <TextField
                id="name_en"
                onChange={handleFormChange}
                error={Boolean(formErrors?.name_en)}
                helperText={formErrors?.name_en}
                value={formData?.name_en || ""}
                fullWidth
                label="Course Name (EN) *"
                variant="outlined"
              />
              <TextField
                id="name_ar"
                onChange={handleFormChange}
                error={Boolean(formErrors?.name_ar)}
                helperText={formErrors?.name_ar}
                value={formData?.name_ar || ""}
                fullWidth
                label="Course Name (AR)"
                variant="outlined"
              />
              {/* Input Field for Course Code */}
              <TextField
                id="courseCode"
                onChange={handleFormChange}
                error={Boolean(formErrors?.courseCode)}
                helperText={formErrors?.courseCode}
                value={formData?.courseCode || ""}
                fullWidth
                label={isEditData ? "Course Code" : "Course Code *"}
                variant="outlined"
              />
              {/* Box for Course Hours and Requires PC */}
              <Box display="flex" alignItems="center" gap={2}>
                {/* Number Input for Course Hours */}
                <TextField
                  id="courseTime"
                  onChange={handleFormChange}
                  error={Boolean(formErrors?.courseTime)}
                  helperText={formErrors?.courseTime}
                  value={formData?.courseTime || ""}
                  type="number"
                  label="Course Hours *"
                  variant="outlined"
                  sx={{ flex: 1 }}
                />

                {/* Checkbox for PC Requirement */}
                <FormControlLabel
                  sx={{ display: "none" }}
                  disabled
                  control={
                    <Checkbox
                    //   onChange={handleFormChange}
                    //   error={Boolean(formErrors?.memberPrice)}
                    //   helperText={formErrors?.memberPrice}
                    //   value={formData.memberPrice || ""}
                    />
                  }
                  label="Requires PC"
                />
              </Box>
            </Box>

            {/* Right Side */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              {/* {!isEditData && ( */}
              <CourseExtras
                isEdit={isEditData}
                editData={editedCourseExtras}
                error={formErrors?.extras}
                isError={Boolean(formErrors?.extras)}
                onDataChange={handleCourseExtrasChange}
              />
              {/* )} */}

              {/* Price for Members and Non-Members */}
              <Box display="flex" gap={2}>
                <TextField
                  id="memberPrice"
                  onChange={handleFormChange}
                  error={Boolean(formErrors?.memberPrice)}
                  helperText={formErrors?.memberPrice}
                  value={formData?.memberPrice || ""}
                  fullWidth
                  type="number"
                  label="Price for Members *"
                  variant="outlined"
                />
                <TextField
                  id="nonMemberPrice"
                  onChange={handleFormChange}
                  error={Boolean(formErrors?.nonMemberPrice)}
                  helperText={formErrors?.nonMemberPrice}
                  value={formData?.nonMemberPrice || ""}
                  fullWidth
                  type="number"
                  label="Price for Non-Members *"
                  variant="outlined"
                />
              </Box>

              {/* Text Area for Notes */}
              <TextField
                id="description_en"
                onChange={handleFormChange}
                error={Boolean(formErrors?.description_en)}
                helperText={formErrors?.description_en}
                value={formData?.description_en || ""}
                fullWidth
                label="Describtion *"
                variant="outlined"
                multiline
                rows={4}
              />
            </Box>
          </Box>
        </div>

        <div className="form-actions">
          {isEditError && (
            <p className="invalid-message">{String(editCourseError)}</p>
          )}

          {isAddCourseError && (
            <p className="invalid-message">
              <p className="invalid-message">{String(addCourseError)}</p>
            </p>
          )}

          {isEditData && (
            <FormButton
              isLoading={editCourseLoading}
              buttonText="Edit"
              className="main-btn form-add-btn"
              onClick={handleEdit}
              type="submit"
            />
          )}

          {!isEditData && (
            <FormButton
              isLoading={addCourseLoading}
              buttonText="Add"
              className="main-btn form-add-btn"
              onClick={handleSubmit}
              type="submit"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default MutationForm;
