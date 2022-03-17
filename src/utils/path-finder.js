import Graph from "node-dijkstra";

import stations from "./stations.json";
import courses from "./courses.json";

import closedCircuitLines from "./closed-circuit-lines.json";
import closedCircuit from "./closed-circuit.json";
import {
  saveGraph,
  getGraph,
  saveLines,
  getLines,
  getStations,
  saveStations,
} from "./local-storage";

//const stationEntries = Object.entries(stations);
const coursesEntries = Object.entries(courses);
//const closedCircuitLinesNames = Object.keys(closedCircuitLines);
const closedCircuitNames = Object.keys(closedCircuit);

let lines = {};
let stationsReduced = {};
let profGraph = {};

/**
 * Intialise the app station network graph.
 */
export const initialise = async () => {
  stationsReduced = getStations();
  console.log("These are the stations", stationsReduced);

  lines = getLines();
  console.log("These are all the lines", lines);

  profGraph = getGraph();
  console.log("This is the graph", profGraph);

  if (!stationsReduced || !lines || !profGraph) {
    //if there is no data in the storage
    lines = {};
    stationsReduced = {};
    profGraph = {};

    const result = await groupProfByLine();
    stationsReduced = result.stationsReduced;
    console.log("This is stations reduced", stationsReduced);

    lines = await getOrderedStations(result.lines);
    console.log("This is getOderedStations", lines);

    profGraph = await buildRailGraph(lines);
    console.log("This is profGraph", profGraph);
  }
};

/**
 * Build and retrun a path of unique line necessaire for the travel
 */
export const getTravelRoute = async (start, end) => {
  const route = new Graph(profGraph); //new graph
  const answer = route.path(start, end, { cost: true }) || []; //this will give us back path from start to end that
  //const paths = route.path(start, end) || []; //this will give us back path from start to end that

  const cost = answer.cost;
  const paths = answer.path;
  console.log("this is hops", cost);

  return paths.reduce((paths, currentProfName, index, path) => {
    //4 parameters
    const currentProfCourses = stationsReduced[currentProfName].lineNames;
    //console.log("this is currentStationLines",currentStationLines)

    if (index > 0) {
      const prevStationName = path[index - 1];
      const prevStationLines = stationsReduced[prevStationName].lineNames;
      // We need to find the line that links 2 stations
      const link = prevStationLines.find((line) =>
        currentProfCourses.includes(line)
      );

      if (!paths.find((pathObj) => pathObj.line === link)) {
        paths.push({
          line: link,
          stationName: prevStationName,
        });
      }
      // Include the last station at the end of itteration
      if (index === path.length - 1) {
        paths.push({
          line: link,
          stationName: currentProfName,
        });
      }
    }
    //console.log("this is paths after reduced",paths)
    return paths;
  }, []);
};

/**
 * Return the list of sorted stations names
 */
export const stationNames = Object.keys(stations).sort();
export const profNames = Object.keys(courses).sort();

/**
 * Group prof by courses
 * And create an extendion of the existing stations map to ease the build of user friendly route message
 * */
const groupProfByLine = async () => {
  const lines = {};
  const stationsReduced = coursesEntries.reduce((acc, [profName, prof]) => {
    const lineNames = Object.keys(prof);
    // Storing the line name each prof is tied to in a new object.
    // Since we are already itterating over the each prof object key here.
    acc[profName] = { lineNames };
    // Group prof by lines
    lineNames.forEach((line) => {
      if (!Object.keys(lines).includes(line)) {
        lines[line] = [{ [profName]: prof, [line]: prof[line] }];
      } else {
        lines[line].push({ [profName]: prof, [line]: prof[line] });
      }
    });
    return acc;
  }, {});
  saveStations(stationsReduced);
  return { lines, stationsReduced };
};

/**
 *  Order the stations in each line according to its position from origin
 */
const getOrderedStations = async (lines) => {
  Object.keys(lines).forEach((lineName) =>
    lines[lineName].sort((a, b) => a[lineName] - b[lineName])
  );
  saveLines(lines);
  return lines;
};

/**
 * Build the rail graph by setting the neihbord of each node, we need to connect each stations to its neihbord.
 * This metho is too long, it need some refactoring.
 * */
const buildRailGraph = async (lines) => {
  //console.log("This is coursesEntries before graph build",coursesEntries)
  const profGraph = coursesEntries.reduce((graph, [stationName, station]) => {
    const graphItem = {};
    Object.keys(station).forEach((line) => {
      const lineStations = lines[line];
      const stationIndex = lineStations.findIndex((lStation) =>
        lStation.hasOwnProperty(stationName)
      );
      const currentStation = lineStations[stationIndex];
      const nextStation = lineStations[stationIndex + 1];
      const prevStation = lineStations[stationIndex - 1];

      if (nextStation) {
        const nextStationName = Object.keys(nextStation).filter(
          (keyName) => keyName !== line
        );
        graphItem[nextStationName] = nextStation[line] - currentStation[line];
      }

      if (prevStation) {
        const prevStationName = Object.keys(prevStation).filter(
          (keyName) => keyName !== line
        );
        graphItem[prevStationName] = currentStation[line] - prevStation[line];
      }

      if (closedCircuitNames.includes(line)) {
        const lastStationName = closedCircuitLines[line].stationName;
        const lastStationPosition =
          closedCircuitLines[line].lastStationPosition;
        if (stationIndex === lineStations.length - 1) {
          graphItem[lastStationName] = lastStationPosition - stationIndex;
        }

        if (lastStationName === stationName) {
          const stationToCC = lineStations[lineStations.length - 1];
          const stationNameToCC = Object.keys(stationToCC).find(
            (key) => typeof stationToCC[key] === "object"
          );
          graphItem[stationNameToCC] = lastStationPosition - stationToCC[line];
        }
      }
    });
    graph[stationName] = graphItem;

    return graph;
  }, {});
  // Save the graph
  saveGraph(profGraph);
  return profGraph;
};
