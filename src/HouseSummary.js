import useFetch from "./useFetch";

let getRecommendedPump = (powerHeatLoss, heatPumps) => {
  let recommendedPump = null;

  heatPumps = heatPumps ?? []; //Set heatPumps to empty array if heatPumps is undefined or null
  powerHeatLoss = powerHeatLoss ?? Number.NaN; //Set powerHeatLoss to NaN if powerHeatLoss is undefined or null

  heatPumps.forEach((pump) => {
    if (!recommendedPump && pump.outputCapacity >= powerHeatLoss) {
      recommendedPump = pump;
    } else if (
      recommendedPump &&
      pump.outputCapacity < recommendedPump.outputCapacity &&
      pump.outputCapacity >= powerHeatLoss
    ) {
      recommendedPump = pump;
    }
  });

  return recommendedPump;
};

let getPowerHeatLoss = (location, heatLoss) => {
  heatLoss = heatLoss ?? Number.NaN; //Set heatLoss to Nan if heatLoss is undefined or null
  let powerHeatLoss = heatLoss / parseInt(location?.[0]?.degreeDays); //set powerHeatLoss to NaN if location or degreeDays is undefined or null
  return powerHeatLoss;
};

let getHeatLoss = (house) =>
  house?.floorArea * house?.heatingFactor * house?.insulationFactor;

const HouseSummary = ({ house, heatPumps }) => {
  const heatLoss = getHeatLoss(house);

  const { data: location, error } = useFetch(
    `http://localhost:8000/weather?location=${house.designRegion}`
  );

  return (
    <div>
      --------------------------------------
      <br />
      {house.submissionId}
      <br />
      --------------------------------------
      <br />
      Estimated Heat Loss = {heatLoss} (kWh)
      <div>
        {error && <div>Warning: Could not find design region</div>}
        {!error && location && (
          <div>
            Design Region = {house.designRegion}
            <br />
            Power Heat Loss = {getPowerHeatLoss(location, heatLoss)} (kW)
            <br />
            Recommended Heat Pump =
            {
              getRecommendedPump(
                getPowerHeatLoss(location, heatLoss),
                heatPumps
              ).label
            }
          </div>
        )}
      </div>
    </div>
  );
};

export { HouseSummary, getPowerHeatLoss, getHeatLoss, getRecommendedPump };
