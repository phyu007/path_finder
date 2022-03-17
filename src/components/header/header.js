import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";

const header = () => {
  const Container = styled.div`
    text-align: center;
    padding: 10px 0;
  `;
  return (
    <Container>
      <h2>
        <FormattedMessage
          id="pathFinder.header.title"
          defaultMessage="I solemnly swear that I am up to no good"
        />
      </h2>
    </Container>
  );
};

export default header;
