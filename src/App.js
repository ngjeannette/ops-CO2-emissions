import "./App.css";
import { useState } from "react";
import { Slider } from "@material-ui/core";
import MapChart from "./MapChart";
import ReactTooltip from "react-tooltip";

function App() {
  const [selectedYear, setSelectedYear] = useState(1990);
  const [content, setContent] = useState("");

  const handleChange = (event, newValue) => {
    setSelectedYear(parseInt(newValue));
  };

  const marks = [
    {
      value: 1990,
      label: "1990",
    },
    {
      value: 2018,
      label: "2018",
    },
  ];

  return (
    <div className="App">
      <h1 variant="h1">{`CO2 Emissions By Year ${selectedYear}`}</h1>
      <div className="opus-slider-container">
        <Slider
          defaultValue={1990}
          aria-labelledby="discrete-slider-always"
          step={1}
          value={selectedYear ? selectedYear : 1990}
          onChange={handleChange}
          min={1990}
          max={2018}
          marks={marks}
          valueLabelDisplay="on"
          getAriaValueText={(value) => value}
        />
      </div>
      <MapChart setTooltipContent={setContent} selectedYear={selectedYear} />
      <ReactTooltip class="tooltip" html={true}>
        {content}
      </ReactTooltip>
    </div>
  );
}

export default App;
