//TODO: Create your own proxy
//TODO: Mocking out requests
import { render, waitFor } from "@testing-library/react";
import App from "./App";

let getByTestId;

beforeEach(() => {
  const component = render(<App />);
  getByTestId = component.getByTestId;
});

describe("App", () => {
  const testHouses = [
    {
      submissionId: "4cb3820a-7bf6-47f9-8afc-3adcac8752cd",
      designRegion: "Severn Valley (Filton)",
      floorArea: 125,
      age: "1967 - 1975",
      heatingFactor: 101,
      insulationFactor: 1.3,
    },
    {
      submissionId: "e21a3149-b88c-40e9-86fd-c94a6b93cb78",
      designRegion: "W Pennines (Ringway)",
      floorArea: 92,
      age: "1991 - 1995",
      heatingFactor: 88,
      insulationFactor: 1.1,
    },
    {
      submissionId: "2191bf41-ce1e-427d-85c3-88d5a44680ae",
      designRegion: "North-Eastern (Leeming)",
      floorArea: 126,
      age: "pre 1900",
      heatingFactor: 131,
      insulationFactor: 1.8,
    },
  ];

  it("displays the submissionId for each house", async () => {
    await waitFor(() =>
      expect(getByTestId(`sid-${testHouses[0].submissionId}`).textContent).toBe(
        testHouses[0].submissionId
      )
    );
  });

  it("displays a warning message when a region cannot be found", async () => {
    await waitFor(() =>
      expect(getByTestId(`dr-${testHouses[2].submissionId}`).textContent).toBe(
        "Warning: Could not find design region"
      )
    );
  });
});
