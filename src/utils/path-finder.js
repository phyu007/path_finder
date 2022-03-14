import Graph from "node-dijkstra";

import stations from "./stations.json";
import closedCircuitLines from "./closed-circuit-lines.json";
import {
  saveGraph,
  getGraph,
  saveLines,
  getLines,
  getStations,
  saveStations
} from "./local-storage";

const stationEntries = Object.entries(stations);
const closedCircuitLinesNames = Object.keys(closedCircuitLines);
let lines = {};
let stationsReduced = {};
let railGraph = {};

/**
 * Intialise the app station network graph.
 */
export const initialise = async () => {
  stationsReduced = getStations();
  lines = getLines();
  railGraph = getGraph();
  if (!stationsReduced || !lines || !railGraph) {
    lines = {};
    stationsReduced = {};
    railGraph = {};

    const result = await groupStationsByLine();
    stationsReduced = result.stationsReduced;
    lines = await getOderedStations(result.lines);
    railGraph = await buildRailGraph(lines);
  }
};

/**
 * Build and retrun a path of unique line necessaire for the travel
 */
export const getTravelRoute = async (start, end) => {
  const route = new Graph(railGraph);
  const paths = route.path(start, end) || [];

  return paths.reduce((paths, currentStationName, index, path) => {
    const currentStationLines = stationsReduced[currentStationName].lineNames;
    if (index > 0) {
      const prevStationName = path[index - 1];
      const prevStationLines = stationsReduced[prevStationName].lineNames;
      // We need to find the line that links 2 stations
      const link = prevStationLines.find(line =>
        currentStationLines.includes(line)
      );

      if (!paths.find(pathObj => pathObj.line === link)) {
        paths.push({
          line: link,
          stationName: prevStationName
        });
      }
      // Include the last station at the end of itteration
      if (index === path.length - 1) {
        paths.push({
          line: link,
          stationName: currentStationName
        });
      }
    }
    return paths;
  }, []);
};

/**
 * Return the list of sorted stations names
 */
export const stationNames = Object.keys(stations).sort();

/**
 * Group station by lines
 * And create an extendion of the existing stations map to ease the build of user friendly route message
 * */
const groupStationsByLine = async () => {
  const lines = {};
  const stationsReduced = stationEntries.reduce(
    (acc, [stationName, station]) => {
      const lineNames = Object.keys(station);
      // Storing the line name each station is tied to in a new object.
      // Since we are already itterating over the each station object key here.
      acc[stationName] = { lineNames };
      // Group station by lines
      lineNames.forEach(line => {
        if (!Object.keys(lines).includes(line)) {
          lines[line] = [{ [stationName]: station, [line]: station[line] }];
        } else {
          lines[line].push({ [stationName]: station, [line]: station[line] });
        }
      });
      return acc;
    },
    {}
  );
  saveStations(stationsReduced);
  return { lines, stationsReduced };
};

/**
 *  Order the stations in eacline according to its position from origin
 */
const getOderedStations = async lines => {
  Object.keys(lines).forEach(lineName =>
    lines[lineName].sort((a, b) => a[lineName] - b[lineName])
  );
  saveLines(lines);
  return lines;
};

/**
 * Build the rail graph by setting the neihbord of each node, we need to connect each stations to its neihbord.
 * This metho is too long, it need some refactoring.
 * */
const buildRailGraph = async lines => {
  const railGraph = stationEntries.reduce((graph, [stationName, station]) => {
    const graphItem = {};
    Object.keys(station).forEach(line => {
      const lineStations = lines[line];
      const stationIndex = lineStations.findIndex(lStation =>
        lStation.hasOwnProperty(stationName)
      );
      const currentStation = lineStations[stationIndex];
      const nextStation = lineStations[stationIndex + 1];
      const prevStation = lineStations[stationIndex - 1];

      if (nextStation) {
        const nextStationName = Object.keys(nextStation).filter(
          keyName => keyName !== line
        );
        graphItem[nextStationName] = nextStation[line] - currentStation[line];
      }

      if (prevStation) {
        const prevStationName = Object.keys(prevStation).filter(
          keyName => keyName !== line
        );
        graphItem[prevStationName] = currentStation[line] - prevStation[line];
      }

      if (closedCircuitLinesNames.includes(line)) {
        const lastStationName = closedCircuitLines[line].stationName;
        const lastStationPosition =
          closedCircuitLines[line].lastStationPosition;
        if (stationIndex === lineStations.length - 1) {
          graphItem[lastStationName] = lastStationPosition - stationIndex;
        }

        if (lastStationName === stationName) {
          const stationToCC = lineStations[lineStations.length - 1];
          const stationNameToCC = Object.keys(stationToCC).find(
            key => typeof stationToCC[key] === "object"
          );
          graphItem[stationNameToCC] = lastStationPosition - stationToCC[line];
        }
      }
    });
    graph[stationName] = graphItem;

    return graph;
  }, {});
  // Save the graph
  saveGraph(railGraph);
  return railGraph;
};
