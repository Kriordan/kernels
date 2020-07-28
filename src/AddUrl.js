import React from "react";

import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  TextField,
  Button,
  Fade,
  Collapse,
  CircularProgress,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

const styles = (theme) => ({
  container: {
    padding: theme.spacing(5, 5, 10, 5),
  },
  button: {
    marginTop: theme.spacing(1),
  },
  form: {
    margin: "50px auto",
    maxWidth: "500px",
    textAlign: "center",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    margin: "50px",
  },
  trackedSelectorAlert: {
    margin: "50px auto",
    maxWidth: "500px",
  },
});

class AddUrl extends React.Component {
  state = {
    inputUrl: "https://www.keithriordan.com",
    isScrapedHtml: false,
    isTrackedSelector: false,
    loading: false,
    scrapedCss: "",
    scrapedHtml: "",
    trackedSelector: "",
    url: "https://www.keithriordan.com",
  };

  componentDidMount() {
    console.log("componentdidmount");
  }

  postUrl = (e) => {
    e.preventDefault();
    console.log("fromposturl");
    const { inputUrl } = this.state;

    this.setState({
      url: this.state.inputUrl,
      isScrapedHtml: false,
      isTrackedSelector: false,
      loading: true,
      trackedSelector: "",
    });

    fetch("/api/scrapePage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: inputUrl }),
    })
      .then((data) => data.json())
      .then((data) => {
        this.setState({
          isScrapedHtml: true,
          loading: false,
          scrapedHtml: data.bodyContents,
          scrapedCss: data.cssResponse,
        });
        if (document.querySelector(".scraped-css")) {
          const oldStyleEl = document.querySelector(".scraped-css");
          document.head.removeChild(oldStyleEl);
        }
        const styleEl = document.createElement("style");
        styleEl.classList.add("scraped-css");
        document.head.appendChild(styleEl);
        styleEl.innerHTML = this.state.scrapedCss;
      });
  };

  handleInput = (e) => {
    this.setState({ inputUrl: e.target.value });
  };

  handleClick = (e) => {
    e.preventDefault();
    this.setState({
      trackedSelector: e.target.textContent,
      isTrackedSelector: true,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      inputUrl,
      isScrapedHtml,
      isTrackedSelector,
      loading,
      scrapedHtml,
      trackedSelector,
    } = this.state;

    return (
      <React.Fragment>
        <form onSubmit={this.postUrl} className={classes.form}>
          <TextField
            fullWidth
            label="Enter url"
            onInput={this.handleInput}
            placeholder="https://catalog.data.gov/dataset/road"
            variant="outlined"
            value={inputUrl}
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
          >
            Submit
          </Button>
        </form>
        {trackedSelector.length > 0 && (
          <Fade in={isTrackedSelector} timeout={500}>
            <Alert severity="info" className={classes.trackedSelectorAlert}>
              <AlertTitle>Now tracking this value:</AlertTitle>
              {trackedSelector}
            </Alert>
          </Fade>
        )}
        {loading === true && (
          <div className={classes.spinner}>
            <CircularProgress />
          </div>
        )}
        <Collapse in={isScrapedHtml} timeout={2000}>
          <Paper className={classes.container}>
            <div
              className="simulator-container"
              dangerouslySetInnerHTML={{ __html: scrapedHtml }}
              onClick={this.handleClick}
            />
          </Paper>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AddUrl);
