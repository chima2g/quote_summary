import heatPumps from "./heatPumps";
import {
  getHeatLoss,
  getPowerHeatLoss,
  getRecommendedPump,
  getTotalCosts,
} from "./HouseSummary";

describe("getHeatLoss", () => {
  test("returns NaN when passed an undefined house", () => {
    const house = undefined;
    expect(Number.isNaN(getHeatLoss(house))).toEqual(true);
  });
  test("returns NaN when passed a house missing insulationFactor property", () => {
    const house = {};
    expect(Number.isNaN(getHeatLoss(house))).toEqual(true);
  });
  test("calculates heatLoss when passed valid house", () => {
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
  const location = [
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

describe("getRecommendedPump", () => {
  test("returns null when passed null powerHeatLoss", () => {
    expect(getRecommendedPump(null, heatPumps)).toEqual(null);
  });
  //TODO: Empty heatPumps
  test("returns null when passed undefined heatPumps", () => {
    expect(getRecommendedPump(8.9, undefined)).toEqual(null);
  });

  test("returns correct heat pump when passed valid powerHeatLoss and heatPumps", () => {
    expect(getRecommendedPump(8.9, heatPumps).label).toEqual("12kW Package");
    expect(getRecommendedPump(8, heatPumps).label).toEqual("8kW Package");
    expect(getRecommendedPump(17, heatPumps)).toEqual(null);
    expect(getRecommendedPump(0, heatPumps).label).toEqual("5kW Package");
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
