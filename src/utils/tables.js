export const getDataForTableRows = (data) => {
  if (!data) return [];
  let rowsData = [];
  if (Array.isArray(data)) {
    const userValues = data ? Object.values(data) : [];
    rowsData = [...userValues];
  } else {
    if (data) {
      rowsData.push(data);
    }
  }

  return rowsData;
};
