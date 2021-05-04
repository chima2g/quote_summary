import useFetch from "./useFetch";

const HouseSummary = ({ house }) => {
  const heatLoss =
    house.floorArea * house.heatingFactor * house.insulationFactor;

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
        {!error && location && <div>Insert required data here</div>}
      </div>
    </div>
  );
};

export default HouseSummary;
