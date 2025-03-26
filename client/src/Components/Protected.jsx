import React from "react";
import Dashboard from "./Pages/MainComponent";

export default function Protected({ children }) {
  return <Dashboard>{children}</Dashboard>;
}
