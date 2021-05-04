import { getHeatLoss, getPowerHeatLoss } from "./HouseSummary";

describe("getHeatLoss", () => {
  test("returns NaN when passed an undefined house", () => {
    let house = undefined;
    expect(Number.isNaN(getHeatLoss(house))).toEqual(true);
  });
  test("returns NaN when passed a house missing insulationFactor property", () => {
    let house = {};
    expect(Number.isNaN(getHeatLoss(house))).toEqual(true);
  });
  test("calculates heatLoss when passed valid house", () => {
    let house = {
      submissionId: "4cb3820a-7bf6-47f9-8afc-3adcac8752cd",
      designRegion: "Severn Valley (Filton)",
      floorArea: 125,
      age: "1967 - 1975",
      heatingFactor: 101,
      insulationFactor: 1.3,
    };
    expect(getHeatLoss(house)).toEqual(16412.5);
  });
});

describe("getPowerHeatLoss", () => {
  let heatLoss = 16412.5;
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

  test("returns NaN when passed undefined location", () => {
    expect(Number.isNaN(getPowerHeatLoss(undefined, heatLoss))).toEqual(true);
  });
  test("returns NaN when passed undefined heatLoss", () => {
    expect(Number.isNaN(getPowerHeatLoss(location, undefined))).toEqual(true);
  });
  test("returns NaN when passed undefined location and undefined heatLoss", () => {
    expect(Number.isNaN(getPowerHeatLoss(location, undefined))).toEqual(true);
  });
  test("calculates powerHeatLoss when passed valid location and heatLoss", () => {
    expect(getPowerHeatLoss(location, heatLoss)).toEqual(8.944141689373296);
  });
});
