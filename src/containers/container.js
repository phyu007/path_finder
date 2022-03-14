import React, { Component } from "react";

import { stationNames, getTravelRoute, initialise } from "../utils/path-finder";
import Header from "../components/header/";
import EntryExit from "../components/entry-exit";
import Itinearary from "../components/itinerary";

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBooted: false,
      entries: stationNames,
      entry: "",
      exits: stationNames,
      exit: "",
      paths: []
    };

    this.handleOnSetEntry = this.handleOnSetEntry.bind(this);
    this.handleOnSetExit = this.handleOnSetExit.bind(this);
  }

  componentDidMount() {
    initialise().then(() =>
      this.setState(state => ({ ...state, isBooted: !state.isBooted }))
    );
  }

  getRoute() {
    if (this.state.entry && this.state.exit) {
      getTravelRoute(this.state.entry, this.state.exit).then(routes =>
        this.setState(state => ({ ...state, paths: routes }))
      );
    }
  }

  handleOnSetEntry(entry) {
    this.setState(
      state => ({
        ...state,
        entry,
        exits: this.removeSelectedStation(entry)
      }),
      () => this.getRoute()
    );
  }

  handleOnSetExit(exit) {
    this.setState(
      state => ({
        ...state,
        exit,
        entries: this.removeSelectedStation(exit)
      }),
      () => this.getRoute()
    );
  }

  removeSelectedStation(station) {
    return stationNames.filter(name => station !== name);
  }
  // render the component
  render() {
    return (
      <div>
        <Header />
        <EntryExit
          entries={this.state.entries}
          exits={this.state.exits}
          onSetEntry={this.handleOnSetEntry}
          onSetExit={this.handleOnSetExit}
        />
        <Itinearary paths={this.state.paths} />
      </div>
    );
  }
}

export default Container;
