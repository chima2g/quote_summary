import useFetch from "./useFetch";

const HouseSummary = ({ house }) => {
  const { data: location, error } = useFetch(
    `http://localhost:8000/weather?location=${house.designRegion}`
  );

  return (
    <div>
      <div>{house.designRegion}</div>
      <div>
        {error && <div>Warning: Could not find design region</div>}
        {!error && location && <div>Insert required data here</div>}
      </div>
    </div>
  );
};

export default HouseSummary;
