"use client";
import * as React from "react";

export const ThemingContext = React.createContext<{ framework: string }>({ framework: "react" });
export const useTheming = () => React.useContext(ThemingContext);
