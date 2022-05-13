import { useSelector, useDispatch } from "react-redux";

import axios from "axios";

export const getData = async () => {
  const res = await axios.get("/api/all-plugins/");
  return res.data;
};
