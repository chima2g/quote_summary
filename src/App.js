import "./App.css";
import houses from "./houses";
import HouseList from "./HouseList";

function App() {
  return (
    <div className="App">
      <h1>Summaries</h1>
      <HouseList houses={houses} />
    </div>
  );
}

export default App;
