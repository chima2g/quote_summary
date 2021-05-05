//TODO: Remove heatPumps import
import heatPumps from "./heatPumps";
import {
  getHeatLoss,
  getPowerHeatLoss,
  getRecommendedPump,
  getTotalCosts,
} from "./HouseSummary";

describe("getHeatLoss", () => {
  const inValidHouse = {
    submissionId: "4cb3820a-7bf6-47f9-8afc-3adcac8752cd",
    designRegion: "Severn Valley (Filton)",
    floorArea: "Invalid Number",
    age: "1967 - 1975",
    heatingFactor: 101,
    insulationFactor: 1.3,
  };

  test("returns NaN when passed an invalid house", () => {
    expect(Number.isNaN(getHeatLoss(undefined))).toEqual(true);
    expect(Number.isNaN(getHeatLoss(null))).toEqual(true);
    expect(Number.isNaN(getHeatLoss({}))).toEqual(true);
    expect(Number.isNaN(getHeatLoss(inValidHouse))).toEqual(true);
  });
  test("calculates heatLoss when passed a valid house", () => {
    const house = {
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
  const heatLoss = 16412.5;
  const validLocation = [
    {
      location: "Severn Valley (Filton)",
      degreeDays: "1835",
      groundTemp: "10.6",
      postcode: "BS7",
      lat: "51.507864",
      lng: "-2.576467",
    },
  ];

  const invalidLocation = [
    {
      degreeDays: "Invalid Number",
    },
  ];

  test("returns NaN when passed invalid location", () => {
    expect(Number.isNaN(getPowerHeatLoss(undefined, heatLoss))).toEqual(true);
    expect(Number.isNaN(getPowerHeatLoss(null, heatLoss))).toEqual(true);
    expect(Number.isNaN(getPowerHeatLoss(invalidLocation, heatLoss))).toEqual(
      true
    );
    expect(Number.isNaN(getPowerHeatLoss([{}], heatLoss))).toEqual(true);
    expect(Number.isNaN(getPowerHeatLoss([], heatLoss))).toEqual(true);
  });
  test("returns NaN when passed invalid heatLoss", () => {
    expect(Number.isNaN(getPowerHeatLoss(validLocation, undefined))).toEqual(
      true
    );
    expect(Number.isNaN(getPowerHeatLoss(validLocation, null))).toEqual(true);
  });
  test("returns NaN when passed invalid location and heatLoss", () => {
    expect(Number.isNaN(getPowerHeatLoss(null, undefined))).toEqual(true);
    expect(Number.isNaN(getPowerHeatLoss(undefined, null))).toEqual(true);
    expect(Number.isNaN(getPowerHeatLoss([], undefined))).toEqual(true);
  });
  test("calculates powerHeatLoss when passed valid location and heatLoss", () => {
    expect(getPowerHeatLoss(validLocation, heatLoss)).toEqual(
      8.944141689373296
    );
  });
});

describe("getRecommendedPump", () => {
  test("returns null when passed invalid powerHeatLoss", () => {
    expect(getRecommendedPump(null, heatPumps)).toEqual(null);
    expect(getRecommendedPump(undefined, heatPumps)).toEqual(null);
  });

  test("returns null when passed invalid heatPumps", () => {
    expect(getRecommendedPump(8.9, undefined)).toEqual(null);
    expect(getRecommendedPump(8.9, null)).toEqual(null);
    expect(getRecommendedPump(8.9, [])).toEqual(null);
  });

  test("returns correct heat pump when passed valid powerHeatLoss and heatPumps", () => {
    expect(getRecommendedPump(8.9, heatPumps).label).toEqual("12kW Package");
    expect(getRecommendedPump(8, heatPumps).label).toEqual("8kW Package");
    expect(getRecommendedPump(17, heatPumps)).toEqual(null);
    expect(getRecommendedPump(0, heatPumps).label).toEqual("5kW Package");
    expect(getRecommendedPump(-1, heatPumps).label).toEqual("5kW Package");
  });
});

describe("getTotalCosts", () => {
  const singleCost = [
    {
      label:
        "Design & Supply of your Air Source Heat Pump System Components (12kW)",
      cost: 5138,
    },
  ];

  const multipleCosts = [
    {
      label:
        "Design & Supply of your Air Source Heat Pump System Components (12kW)",
      cost: 5138,
    },
    {
      label: "Installation of your Air Source Heat Pump and Hot Water Cylinder",
      cost: 2900,
    },
    {
      label: "Supply & Installation of your Homely Smart Thermostat",
      cost: 150,
    },
  ];

  const freeCost = [
    {
      label:
        "Design & Supply of your Air Source Heat Pump System Components (12kW)",
      cost: 0,
    },
  ];

  test("returns NaN when passed invalid costs", () => {
    expect(Number.isNaN(getTotalCosts(undefined))).toEqual(true);
    expect(Number.isNaN(getTotalCosts(null))).toEqual(true);
  });

  test("returns NaN when passed costs that do not contain at least one cost", () => {
    expect(Number.isNaN(getTotalCosts([{}]))).toEqual(true);
    expect(Number.isNaN(getTotalCosts([]))).toEqual(true);
  });

  test("returns correct value when passed a single cost", () => {
    expect(getTotalCosts(singleCost)).toEqual(5138 * 1.05);
  });

  test("returns correct value when passed multiple costs", () => {
    expect(getTotalCosts(multipleCosts)).toEqual(8188 * 1.05);
  });

  test("returns 0 value when passed costs totalling 0", () => {
    expect(getTotalCosts(freeCost)).toEqual(0);
  });
});
