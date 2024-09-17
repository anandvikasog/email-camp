"use client";

import React, { ReactNode, JSX, useState, useEffect, Fragment } from "react";
import useEnhancedEffect from "@mui/utils/useEnhancedEffect";

export interface NoSsrProps {
  children?: ReactNode;
  defer?: boolean;
  fallback?: ReactNode;
}

// https://github.com/mui/material-ui/blob/master/packages/mui-base/src/NoSsr/NoSsr.tsx
// without prop-types
export function NoSsr(props: NoSsrProps): JSX.Element {
  const { children, defer = false, fallback = null } = props;
  const [mountedState, setMountedState] = useState(false);

  useEnhancedEffect((): void => {
    if (!defer) {
      setMountedState(true);
    }
  }, [defer]);

  useEffect((): void => {
    if (defer) {
      setMountedState(true);
    }
  }, [defer]);

  return <Fragment>{mountedState ? children : fallback}</Fragment>;
}
