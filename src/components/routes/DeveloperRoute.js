import axios from "axios";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth.js";
import { useState, useEffect } from "react";

import Spinner from "../Spinner.js";

export default function AdminRoute() {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/auth/developer-auth`
      );
      if (response.status === 200) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path={"developer"} />;
}
