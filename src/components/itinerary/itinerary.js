import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";

const Smiley = styled.span`
  font-size: 30px;
`;
const ListItem = styled.li`
  padding: 5px 0;
  em {
    font-weight: bold;
  }
`;
const Container = styled.div`
  background-color: #1a252f;
  padding: 20px 40px;
`;

const Itinerary = ({ paths }) => {
  const renderItinerary = () => (
    <ol>
      {paths.map((path, index) => {
        // first station
        if (index === 0) {
          return (
            <ListItem key={path.stationName}>
              <FormattedMessage
                id="pathFinder.itinerary.takeLine"
                defaultMessage="Take line"
              />
              <em> {path.line} </em>
              <FormattedMessage
                id="pathFinder.itinerary.fromStation"
                defaultMessage="from station"
              />
              <em> {path.stationName}.</em>
            </ListItem>
          );
        }
        // last station
        if (index === paths.length - 1) {
          return (
            <ListItem key={path.stationName}>
              <FormattedMessage
                id="pathFinder.itinerary.exitAtStation"
                defaultMessage="Exit at station"
              />
              <em> {path.stationName}.</em>
            </ListItem>
          );
        }

        // Interchange station
        return (
          <ListItem key={path.stationName}>
            <FormattedMessage
              id="pathFinder.itinerary.changeToLine"
              defaultMessage="Take line"
            />
            <em> {path.line} </em>
            <FormattedMessage
              id="pathFinder.itinerary.atStation"
              defaultMessage="at station"
            />
            <em> {path.stationName}.</em>
          </ListItem>
        );
      })}
    </ol>
  );

  const renderComponent = () => {
    if (paths.length) {
      return (
        <Container>
          <div>
            <FormattedMessage
              id="pathFinder.itinerary.letsGo"
              defaultMessage="Lets go"
            />
            <Smiley> &#x263A; </Smiley>
          </div>
          <div>{renderItinerary()}</div>
          <div>
            <FormattedMessage
              id="pathFinder.itinerary.pleasantJourney"
              defaultMessage="Lets go"
            />
            <Smiley> &#x263A; </Smiley>
          </div>
        </Container>
      );
    }
    return null;
  };

  return renderComponent();
};

Itinerary.propTypes = {
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      line: PropTypes.string,
      stationName: PropTypes.string
    })
  ).isRequired
};

export default Itinerary;
