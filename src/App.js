import React from "react";
import { Router } from "@reach/router";

import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Container } from "@material-ui/core";

import Header from "./Header";
import AddUrl from "./AddUrl";
import UrlList from "./UrlList";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        <Router>
          <AddUrl path="/" />
          <UrlList path="/urls"></UrlList>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;
