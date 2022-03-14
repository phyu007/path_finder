import React, { Component } from "react";
import PropTypes from "prop-types";
import Autocomplete from "react-autocomplete";
import { FormattedMessage } from "react-intl";

import {
  InputGroup,
  InputGroupLabel,
  InputGroupText,
  ListHeader,
  ListItem
} from "./atoms";

class AutocompleteTextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      stations: [],
      loading: false
    };

    this.handleOnchange = this.handleOnchange.bind(this);
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  handleOnSelect(value, station) {
    this.setState(
      state => ({ ...state, value, stations: [station] }),
      () => this.props.onValueSet(value)
    );
  }

  handleOnchange(value) {
    this.setState({ value, loading: true, stations: [] });
    this.filterStations(value).then(items =>
      this.setState(state => ({
        ...state,
        stations: items,
        loading: false
      }))
    );
  }

  async filterStations(substring) {
    const filteredStations = this.props.stations.filter(station =>
      station.toLowerCase().includes(substring.toLowerCase())
    );
    return await this.buildDropdownItems(filteredStations);
  }

  async buildDropdownItems(stations) {
    return stations.reduce((items, station) => {
      const isNewHeader = items.find(
        item =>
          item.header &&
          item.header.toLowerCase() === station.charAt(0).toLowerCase()
      );
      if (!isNewHeader) {
        items.push({ header: station.charAt(0).toUpperCase() });
      }
      items.push({ name: station });

      return items;
    }, []);
  }

  renderAutocompleteItem(item, isHighlighted) {
    return item.header ? (
      <ListHeader key={item.header}>{item.header}</ListHeader>
    ) : (
      <ListItem key={item.name}>{item.name}</ListItem>
    );
  }

  renderAutocompleteMenu(items, value, style) {
    const munuStyle = {
      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
      padding: "2px 0",
      fontSize: "90%",
      position: "fixed",
      overflow: "auto",
      maxHeight: "40%"
    };
    return (
      <div style={{ ...style, ...munuStyle }}>
        {value === "" ? (
          <ListItem>
            <FormattedMessage
              id="pathFinder.autocompleteTextBox.message"
              defaultMessage="Enter the name of a station"
            />
          </ListItem>
        ) : this.state.loading ? (
          <ListItem>
            <FormattedMessage
              id="pathFinder.autocompleteTextBox.loading"
              defaultMessage="Loading ..."
            />
          </ListItem>
        ) : items.length === 0 ? (
          <ListItem>
            <FormattedMessage
              id="pathFinder.autocompleteTextBox.noMathes"
              defaultMessage="No matches for "
            />
            {value}
          </ListItem>
        ) : (
          items
        )}
      </div>
    );
  }

  renderAutocomplete() {
    return (
      <Autocomplete
        value={this.state.value}
        inputProps={{ id: "station-autocomplete" }}
        items={this.state.stations}
        getItemValue={item => item.name}
        onSelect={(value, station) => this.handleOnSelect(value, station)}
        onChange={(_, value) => this.handleOnchange(value)}
        renderItem={(item, isHighlighted) =>
          this.renderAutocompleteItem(item, isHighlighted)
        }
        renderMenu={(items, value, style) =>
          this.renderAutocompleteMenu(items, value, style)
        }
        isItemSelectable={item => !item.header}
      />
    );
  }

  render() {
    return (
      <div>
        <InputGroup>
          <InputGroupLabel>
            <label htmlFor="selectedStation">
              <FormattedMessage id={this.props.label} defaultMessage="From" />
            </label>
          </InputGroupLabel>
          <InputGroupText>{this.renderAutocomplete()}</InputGroupText>
        </InputGroup>
        <div />
      </div>
    );
  }
}

AutocompleteTextBox.propTypes = {
  label: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onValueSet: PropTypes.func.isRequired
};

export default AutocompleteTextBox;
