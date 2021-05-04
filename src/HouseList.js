import houses from "./houses";
import HouseSummary from "./HouseSummary";
import heatPumps from "./heatPumps";
import { v4 as uuidv4 } from "uuid";

const HouseList = () => {
  return (
    <div>
      {houses.map((house) => (
        <div key={uuidv4()}>
          {<HouseSummary house={house} heatPumps={heatPumps} />}
        </div>
      ))}
    </div>
  );
};

export default HouseList;
