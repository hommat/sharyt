import React from "react";
import { Link } from "react-router-dom";

import styled from "../styles";

const SHeader = styled.header`
  background: ${(props) => props.theme.colors.primary};
  padding: 0.65em;
  margin-bottom: 1.5em;
  text-align: center;
`;

const SLink = styled(Link)`
  color: ${(props) => props.theme.colors.light};
  cursor: pointer;
`;

const Header = () => {
  return (
    <SHeader>
      <div className="container">
        <SLink to="/">
          <h2>Sharyt</h2>
        </SLink>
      </div>
    </SHeader>
  );
};

export default Header;
