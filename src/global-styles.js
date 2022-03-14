import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *{
    margin:0;
    box-sizing:border-box;
  }
  html,
  body {
    height: 100%;
    width: 100%; 
    background: url(sg-bg.jpg) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #e1e1e1;
    display: flex;
    justify-content: center;
  }
  body.fontLoaded {
    font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  p,
  label {
    line-height: 1.3em;
  }
  h1,h2, h3,h4,h5,h6 {
    font-weight:400;
    margin: 20px 0;
  }

  .app {
    padding:0 20px;
    max-width: 700px;
    margin: 20px 0;
    background-color: #2C3E50;
  }
`;

export default GlobalStyle;
