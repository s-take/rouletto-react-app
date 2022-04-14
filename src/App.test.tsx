import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main page correctly", async () => {
  render(<App />);
});
