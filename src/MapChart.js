import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";
import { scaleQuantize } from "d3-scale";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const MapChart = ({ setTooltipContent, selectedYear }) => {
  const [CO2Data, setCO2Data] = useState({});

  useEffect(() => {
    getCO2();
  }, []);

  const getCO2 = () =>
    fetch(
      "https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.json"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setCO2Data(responseJson);
      })
      .catch((error) => {
        console.error(error);
      });

  const findCountryData = (countryIso) => {
    return Object.entries(CO2Data).reduce((acc, [key, curr]) => {
      if (curr["iso_code"] === countryIso) {
        const yearData = curr.data.filter((year) => year.year === selectedYear);
        acc = [...acc, ...yearData];
      }
      return acc;
    }, []);
  };

  const colorScale = scaleQuantize()
    .domain([1, 10])
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618",
    ]);

  const handleMouseEnter = (currentCountryData, NAME) => {
    let tooltipText = "No data available";
    if (currentCountryData.length > 0) {
      const value = Object.entries(currentCountryData[0]).map(
        ([key, value]) => `${key.split("_").join(" ")} : ${value}`
      );
      tooltipText = value.join(", ");
    }
    setTooltipContent(`${NAME} <br /> <br /> ${tooltipText}`);
  };
  return (
    <>
      <ComposableMap
        data-tip=""
        projectionConfig={{ scale: 170 }}
        style={{ width: "450px", height: "auto" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const { NAME, ISO_A3 } = geo.properties;
                const currentCountryData = findCountryData(ISO_A3);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      handleMouseEnter(currentCountryData, NAME);
                    }}
                    onMouseLeave={() => {
                      setTooltipContent("");
                    }}
                    stroke="black"
                    fill={
                      currentCountryData[0]
                        ? colorScale(currentCountryData[0]["co2"])
                        : "black"
                    }
                    width={300}
                    height={300}
                    style={{
                      hover: {
                        fill: "#b6bee3",
                        outline: "#b6bee3",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
