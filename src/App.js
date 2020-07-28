import React from "react";

import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline, Container } from "@material-ui/core";

import Header from "./Header";
import AddUrl from "./AddUrl";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container maxWidth="lg">
        <AddUrl />
      </Container>
    </ThemeProvider>
  );
}

export default App;
