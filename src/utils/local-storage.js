const graphKey = "mbakop-react-path-finder-graph-key";
const LinesKey = "mbakop-react-path-finder-lines-key";
const reducedStationsKey = "mbakop-react-path-finder-reduced-stations-key";
const isLocalStorage = typeof Storage !== "undefined";

export const getGraph = () => getItem(graphKey);
export const saveGraph = graphObj => setItem(graphObj, graphKey);
export const getLines = () => getItem(LinesKey);
export const saveLines = linesObj => setItem(linesObj, LinesKey);
export const getStations = () => getItem(reducedStationsKey);
export const saveStations = staionsObj =>
  setItem(staionsObj, reducedStationsKey);

const setItem = (item, key) => {
  if (isLocalStorage && item) {
    localStorage.setItem(key, JSON.stringify(item));
  }
};

const getItem = key => {
  if (isLocalStorage) {
    const item = localStorage.getItem(key);
    return item && JSON.parse(item);
  }
  return null;
};
