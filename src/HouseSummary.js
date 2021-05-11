import { v4 as uuidv4 } from "uuid";
import useFetch from "./useFetch";
import {
  getHeatLoss,
  getPowerHeatLoss,
  getRecommendedPump,
  getTotalCosts,
} from "./calculators";

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

  let designRegionText = "";

  if (error) designRegionText = "Warning: Could not find design region";
  else designRegionText = location ?? `Design Region = ${house.designRegion}`;

  const isDataRetrieved = !error && location;

  return (
    <div>
      --------------------------------------
      <br />
      <div data-testid={`sid-${house.submissionId}`}>{house.submissionId}</div>
      <br />
      --------------------------------------
      <br />
      <div>Estimated Heat Loss = {heatLoss} (kWh)</div>
      <div data-testid={`dr-${house.submissionId}`}>{designRegionText}</div>
      {isDataRetrieved && (
        <div>
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
          Total Cost, including VAT ={" "}
          {formatter.format(getTotalCosts(recommendedPump.costs))}
        </div>
      )}
    </div>
  );
};

export default HouseSummary;
