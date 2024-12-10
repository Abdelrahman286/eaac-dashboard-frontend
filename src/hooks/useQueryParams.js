import { useLocation } from "react-router-dom";

const useQueryParam = (param) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get(param);
};

export default useQueryParam;
