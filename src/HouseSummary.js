import useFetch from "./useFetch";

let getPowerHeatLoss = (location, heatLoss) => {
  heatLoss = heatLoss ?? Number.NaN; //Set heatLoss to Nan if undefined or null
  let powerHeatLoss = heatLoss / parseInt(location?.[0]?.degreeDays); //set powerHeatLoss to NaN if location or degreeDays is undefined or null
  return powerHeatLoss;
};

let getHeatLoss = (house) =>
  house?.floorArea * house?.heatingFactor * house?.insulationFactor;

const HouseSummary = ({ house }) => {
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
          </div>
        )}
      </div>
    </div>
  );
};

export { HouseSummary, getPowerHeatLoss, getHeatLoss };
