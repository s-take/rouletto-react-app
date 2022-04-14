import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";

test("renders toolbar title", () => {
  render(<Header />);
  const title = screen.getByText(/担当者決めアプリ/i);
  expect(title).toBeInTheDocument();
});
