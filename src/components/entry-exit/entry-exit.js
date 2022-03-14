import React from "react";
import PropTypes from "prop-types";

import { Container } from "./atoms";
import AutocompleteTextBox from "./autocomplete-text-box";

const EntryExit = ({ entries, exits, onSetEntry, onSetExit }) => {
  return (
    <Container>
      <AutocompleteTextBox
        stations={entries}
        onValueSet={onSetEntry}
        label="pathFinder.autocompleteTextBox.from"
      />
      <AutocompleteTextBox
        stations={exits}
        onValueSet={onSetExit}
        label="pathFinder.autocompleteTextBox.to"
      />
    </Container>
  );
};

EntryExit.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.string.isRequired),
  exits: PropTypes.arrayOf(PropTypes.string.isRequired),
  onSetEntry: PropTypes.func.isRequired,
  onSetExit: PropTypes.func.isRequired
};

export default EntryExit;
