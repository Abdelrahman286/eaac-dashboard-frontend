import React, { useEffect, useState, useContext } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// MUI
import {
  Box,
  TextField,
  Autocomplete,
  Checkbox,
  TextareaAutosize,
  FormControl,
  FormHelperText,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// contexts
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
// components
import FormButton from "../FormButton";

// Requests
import {
  editCategoryFn,
  createCategoryFn,
  getCategoryFn,
  getBranchesFn,
} from "../../requests/courseCategories";

// validations
import { validateAddCourseCategory } from "../../utils/requestValidations";

// utils
import { getDataForTableRows } from "../../utils/tables";

const MutationForm = ({ onClose, isEditData, data }) => {
  const { showSnackbar } = useContext(AppContext);
  const queryClient = useQueryClient();
  const { token } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const [categoryType, setCategoryType] = useState("main");

  const handleCategoryChange = (e) => {
    setCategoryType(e.target.value);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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

    queryKey: ["branchesForCategories"],
  });
  const branches = getDataForTableRows(branchesList?.success?.response?.data);

  // Main Categories
  const { data: mainCategoriesList, isLoading: mainCategoriesLoading } =
    useQuery({
      queryFn: () => {
        return getCategoryFn(
          {
            numOfElements: "2000",
            main: "1",
          },
          token
        );
      },

      queryKey: ["mainCategories"],
    });
  const mainCategories = getDataForTableRows(
    mainCategoriesList?.success?.response?.data
  );

  // send course data
  const {
    mutate: sendAddCategory,
    isPending: addLoading,
    isError: isAddError,
    error: addError,
  } = useMutation({
    mutationFn: createCategoryFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["courseCategory-pagination"]);
      queryClient.invalidateQueries(["courseCategory-list"]);
      showSnackbar("Course Category Added Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at adding new Room", error);
      showSnackbar("Failed to Add New Course Category", "error");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const isSubcategory = categoryType !== "main";
    const errors = validateAddCourseCategory(formData, isSubcategory);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      sendAddCategory({
        reqBody: formData,
        token,
      });
    }
  };

  //   initialize edit data filling
  useEffect(() => {
    if (!isEditData || !data) return;
    const rawFormData = {
      id: [data.id],
      name_ar: data?.Name_ar || "",
      name_en: data?.Name_en || "",
      parentId: data?.ParentID?.id || "",
      branchId: data?.BranchID?.id || "",
      description_en: data?.Description_en || "",
      categoryCode: data?.CourseCategoryCode || "",
    };

    // Remove properties with empty string, null, or undefined values
    const newFormData = Object.fromEntries(
      Object.entries(rawFormData).filter(([_, value]) => value)
    );

    setFormData(newFormData);
  }, [isEditData, data]);

  const {
    mutate: editCategory,
    isPending: editLoading,
    isError: isEditError,
    error: editError,
  } = useMutation({
    mutationFn: editCategoryFn,
    onSuccess: () => {
      onClose();
      queryClient.invalidateQueries(["courseCategory-pagination"]);
      queryClient.invalidateQueries(["courseCategory-list"]);
      showSnackbar("Course Category is Edited Successfully", "success");
    },
    onError: (error) => {
      console.log("Error at editing category data", error);
      showSnackbar("Failed to edit Category Data", "error");
    },
  });

  const handleEdit = (e) => {
    e.preventDefault();

    const isSubcategory = Boolean(data?.ParentID?.id);
    const errors = validateAddCourseCategory(formData, isSubcategory);
    console.log(errors);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      editCategory({
        reqBody: formData,
        token,
      });
    }
  };

  // for DEBUG
  useEffect(() => {
    console.log(formData);
  }, [formData]);

  return (
    <div className="category-form-page">
      <form>
        <div className="category-form">
          <Box
            sx={{
              display: "flex",
              gap: 4,
              justifyContent: "space-between",
              padding: 2,
            }}
          >
            {/* Left Side */}
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              {!isEditData && (
                <FormControl component="fieldset">
                  <FormLabel>Choose Category Type</FormLabel>
                  <RadioGroup
                    aria-label="category-type"
                    name="category-type"
                    value={categoryType}
                    onChange={handleCategoryChange}
                  >
                    <FormControlLabel
                      value="main"
                      control={<Radio />}
                      label="Main Category"
                    />
                    <FormControlLabel
                      value="sub"
                      control={<Radio />}
                      label="Subcategory"
                    />
                  </RadioGroup>
                </FormControl>
              )}

              {!isEditData && categoryType == "sub" ? (
                <FormControl fullWidth>
                  <Autocomplete
                    loading={mainCategoriesLoading}
                    value={
                      mainCategories.find(
                        (item) => item.id === formData.parentId
                      ) || null
                    }
                    options={mainCategories}
                    getOptionLabel={(option) => option?.Name_en}
                    onChange={(e, value) =>
                      setFormData({ ...formData, parentId: value?.id || null })
                    }
                    renderInput={(params) => (
                      <TextField
                        id="parentId"
                        error={Boolean(formErrors?.parentId)}
                        helperText={formErrors?.parentIds}
                        {...params}
                        label="Select Main Category *"
                      />
                    )}
                  />
                  {/* Additional helper text */}
                  <FormHelperText></FormHelperText>
                </FormControl>
              ) : (
                ""
              )}
              {/* //data?.ParentID?.length */}
              {isEditData && data?.ParentID?.id ? (
                <FormControl fullWidth>
                  <Autocomplete
                    loading={mainCategoriesLoading}
                    value={
                      mainCategories.find(
                        (item) => item.id === formData.parentId
                      ) || null
                    }
                    options={mainCategories}
                    getOptionLabel={(option) => option?.Name_en}
                    onChange={(e, value) =>
                      setFormData({ ...formData, parentId: value?.id || null })
                    }
                    renderInput={(params) => (
                      <TextField
                        id="parentId"
                        error={Boolean(formErrors?.parentId)}
                        helperText={formErrors?.parentIds}
                        {...params}
                        label="Select Main Category *"
                      />
                    )}
                  />
                  {/* Additional helper text */}
                  <FormHelperText></FormHelperText>
                </FormControl>
              ) : (
                ""
              )}
              <TextField
                id="name_en"
                onChange={handleFormChange}
                error={Boolean(formErrors?.name_en)}
                helperText={formErrors?.name_en}
                value={formData?.name_en || ""}
                label={
                  categoryType == "sub"
                    ? "Subcategory Name (EN) *"
                    : "Category Name (EN) *"
                }
              />
              <TextField
                id="name_ar"
                onChange={handleFormChange}
                error={Boolean(formErrors?.name_ar)}
                helperText={formErrors?.name_ar}
                value={formData?.name_ar || ""}
                label={
                  categoryType == "sub"
                    ? "Subcategory Name (AR) *"
                    : "Category Name (AR) *"
                }
              />
            </Box>

            {/* Right Side */}
            <Box
              sx={{
                width: 330,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Autocomplete
                id="branchId"
                loading={branchesLoading}
                value={
                  branches.find((branch) => branch.id === formData.branchId) ||
                  null
                }
                options={branches}
                getOptionLabel={(option) => option?.Name_en}
                onChange={(e, value) =>
                  setFormData({ ...formData, branchId: value.id })
                }
                renderInput={(params) => (
                  <TextField
                    id="branchId"
                    error={Boolean(formErrors?.branchId)}
                    helperText={formErrors?.branchId}
                    {...params}
                    label="Select Branch *"
                  />
                )}
              />
              <TextField
                id="categoryCode"
                onChange={handleFormChange}
                error={Boolean(formErrors?.categoryCode)}
                helperText={formErrors?.categoryCode}
                value={formData?.categoryCode || ""}
                label="Category Code"
                name="categoryCode"
              />
              <TextField
                placeholder="Course Category Description/Notes"
                id="description_en"
                label="Description"
                onChange={handleFormChange}
                // error={formErrors?.descriptionEn ? true : undefined} //
                error={Boolean(formErrors?.description_en)}
                helperText={formErrors?.description_en}
                value={formData?.description_en || ""}
                multiline
                minRows={4}
                fullWidth
                variant="outlined"
                style={{
                  padding: 1,
                  borderRadius: 4,
                }}
              />
            </Box>
          </Box>
        </div>

        <div className="form-actions">
          {isEditError && (
            <p className="invalid-message">{String(editError)}</p>
          )}

          {isAddError && <p className="invalid-message">{String(addError)}</p>}

          {isEditData && (
            <FormButton
              isLoading={editLoading}
              buttonText="Edit"
              className="main-btn form-add-btn"
              onClick={handleEdit}
              type="submit"
            />
          )}

          {!isEditData && (
            <FormButton
              isLoading={addLoading}
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
