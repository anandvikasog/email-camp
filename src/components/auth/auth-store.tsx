"use client";

import { logIn } from "@/store/Features/auth/authSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const AddAuthData = ({ userData }: { userData: any }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logIn(userData));
  }, [userData, dispatch]);
  return <></>;
};

export default AddAuthData;
