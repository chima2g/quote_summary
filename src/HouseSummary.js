import { v4 as uuidv4 } from "uuid";
import useFetch from "./useFetch";

const getRecommendedPump = (powerHeatLoss, heatPumps) => {
  let recommendedPump = null;

  heatPumps = heatPumps ?? []; //Set heatPumps to empty array if heatPumps is undefined or null
  powerHeatLoss = powerHeatLoss ?? Number.NaN; //Set powerHeatLoss to NaN if powerHeatLoss is undefined or null

  heatPumps.forEach((pump) => {
    if (!recommendedPump && pump.outputCapacity >= powerHeatLoss) {
      recommendedPump = pump; //Set initial recommendedPump
    } else if (
      recommendedPump &&
      pump.outputCapacity < recommendedPump.outputCapacity &&
      pump.outputCapacity >= powerHeatLoss
    ) {
      recommendedPump = pump; //Update recommendedPump if cheaper solution
    }
  });

  return recommendedPump;
};

const getPowerHeatLoss = (location, heatLoss) => {
  heatLoss = heatLoss ?? Number.NaN; //Set heatLoss to Nan if heatLoss is undefined or null
  const powerHeatLoss = heatLoss / parseInt(location?.[0]?.degreeDays); //set powerHeatLoss to NaN if location or degreeDays is undefined or null
  return powerHeatLoss;
};

const getHeatLoss = (house) =>
  house?.floorArea * house?.heatingFactor * house?.insulationFactor;

const getTotalCosts = (costs) => {
  let total = costs?.reduce((accumulator, cost) => {
    return accumulator + cost?.cost;
  }, 0);

  total = total ?? Number.NaN; //Set total to NaN if costs is undefined or null

  if (Array.isArray(costs) && !costs.length) total = Number.NaN; //Set total to NaN if costs is empty, assuming all pumps should have a cost

  return total * 1.05;
};

const HouseSummary = ({ house, heatPumps }) => {
  const { data: location, error } = useFetch(
    `http://localhost:8000/weather?location=${house.designRegion}`
  );

  const heatLoss = getHeatLoss(house);
  const recommendedPump = getRecommendedPump(
    getPowerHeatLoss(location, heatLoss),
    heatPumps
  );

  const formatter = new Intl.NumberFormat("en-UK", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  });

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
            Recommended Heat Pump = {recommendedPump.label}
            <br />
            Cost Breakdown
            {recommendedPump.costs.map((cost) => (
              <div key={uuidv4()}>
                {cost.label}, £{cost.cost}
              </div>
            ))}
            <br />
            Total Cost, including VAT =
            {formatter.format(getTotalCosts(recommendedPump.costs))}
          </div>
        )}
      </div>
    </div>
  );
};

export {
  HouseSummary,
  getPowerHeatLoss,
  getHeatLoss,
  getRecommendedPump,
  getTotalCosts,
};
