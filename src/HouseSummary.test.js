import { getPowerHeatLoss } from "./HouseSummary";

let location = [
  {
    location: "Severn Valley (Filton)",
    degreeDays: "1835",
    groundTemp: "10.6",
    postcode: "BS7",
    lat: "51.507864",
    lng: "-2.576467",
  },
];

describe("getPowerHeatLoss", () => {
  let heatLoss = 16412.5;

  test("getPowerHeatLoss returns NaN when passed undefined location", () => {
    expect(Number.isNaN(getPowerHeatLoss(undefined, heatLoss))).toEqual(true);
  });
  test("getPowerHeatLoss returns NaN when passed undefined heatLoss", () => {
    expect(Number.isNaN(getPowerHeatLoss(location, undefined))).toEqual(true);
  });
  test("getPowerHeatLoss returns NaN when passed undefined location and undefined heatLoss", () => {
    expect(Number.isNaN(getPowerHeatLoss(location, undefined))).toEqual(true);
  });
  test("getPowerHeatLoss calculates powerHeatLoss when passed valid location and heatLoss", () => {
    expect(getPowerHeatLoss(location, heatLoss)).toEqual(8.944141689373296);
  });
});
