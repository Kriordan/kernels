import React from "react";

import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";
import Container from "@material-ui/core/Container";

import Header from "./Header";
import AddUrl from "./AddUrl";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="sm">
        <AddUrl />
      </Container>
    </ThemeProvider>
  );
}

export default App;
