import "@testing-library/jest-dom";
import fetchMock from "jest-fetch-mock";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

// Snapshot test — checks UI doesn’t change unexpectedly
test("renders GitHub Explorer header", () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});

// Unit test for SearchForm and fetch call simulation
test("allows user to search and shows loading", async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          login: "testuser",
          avatar_url: "https://example.com/avatar.png",
          name: "Test User",
          bio: "Hello there",
          html_url: "https://github.com/testuser",
        }),
    })
  );

  render(<App />);

  // Type username
  fireEvent.change(screen.getByPlaceholderText(/enter github username/i), {
    target: { value: "testuser" },
  });

  // Click search button
  fireEvent.click(screen.getByText(/search/i));

  // Check loading text appears
  expect(screen.getByText(/loading user data/i)).toBeInTheDocument();

  // Wait for user data to show
  await waitFor(() => screen.getByText(/test user/i));

  expect(screen.getByText(/hello there/i)).toBeInTheDocument();
  expect(screen.getByRole("img")).toHaveAttribute(
    "src",
    "https://example.com/avatar.png"
  );

  // Cleanup mock
  global.fetch.mockRestore();
});
