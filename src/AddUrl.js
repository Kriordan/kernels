import React from "react";

import { withStyles } from "@material-ui/core/styles";
import {
  Paper,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Fade,
  Collapse,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  "simulator-wrapper": {
    transform: "translateZ(0)",
  },
  spinner: {
    display: "flex",
    justifyContent: "center",
    margin: "50px",
  },
  valueCard: {
    margin: "50px auto",
    maxWidth: "500px",
  },
  valueCardDescription: {
    margin: "50px auto",
    textAlign: "center",
  },
  testAccordionDetails: {
    flexDirection: "column",
  },
  testButton: {
    margin: "5px 0",
  },
});

class AddUrl extends React.Component {
  state = {
    inputUrl: "https://gis-mdc.opendata.arcgis.com/datasets/address-1",
    isExpanded: false,
    isScrapedHtml: false,
    isTrackedSelector: false,
    loading: false,
    scrapedCss: "",
    scrapedHtml: "",
    trackedSelector: "",
    url: "https://www.keithriordan.com",
  };

  generateXpath = (element) => {
    const idx = (sib, name) =>
      sib
        ? idx(sib.previousElementSibling, name || sib.localName) +
          (sib.localName === name)
        : 1;
    const segs = (elm) =>
      !elm || elm.nodeType !== 1
        ? [""]
        : elm.id && document.getElementById(elm.id) === elm
        ? [`id("${elm.id}")`]
        : [
            ...segs(elm.parentNode),
            `${elm.localName.toLowerCase()}[${idx(elm)}]`,
          ];
    const path = segs(element).join("/");
    console.log(path);
    console.log(this.logUniquenessOfXpath(path));
    return segs(element).join("/");
  };

  logUniquenessOfXpath = (path) => {
    return new XPathEvaluator().evaluate(
      path,
      document.documentElement,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
  };

  postUrl = (e) => {
    e.preventDefault();
    const { inputUrl } = this.state;

    this.setState({
      url: this.state.inputUrl,
      isScrapedHtml: false,
      isTrackedSelector: false,
      loading: true,
      trackedSelector: "",
    });

    fetch("/api/scrapeForRender", {
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
    console.log(e.target);
    this.setState({
      trackedSelector: e.target.textContent
        ? e.target.textContent
        : "This element has no value to track. Please select something else.",
      isTrackedSelector: true,
    });
    this.generateXpath(e.target);
  };

  handleSubmitTrackingValue = () => {};

  handleTestAccordion = (e) => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  handleTestUrlClick = async (e) => {
    await this.setState({ inputUrl: e.target.textContent, isExpanded: false });
    this.postUrl(e);
  };

  render() {
    const { classes } = this.props;
    const {
      inputUrl,
      isExpanded,
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
            Render URL Locally
          </Button>
        </form>
        <Accordion
          classes={{
            root: classes.testAccordion,
            expanded: classes.testAccordionExpanded,
          }}
          expanded={isExpanded}
          onChange={this.handleTestAccordion}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Test Urls</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.testAccordionDetails}>
            <Button
              classes={{ root: classes.testButton }}
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleTestUrlClick}
            >
              https://www.keithriordan.com
            </Button>
            <Button
              classes={{ root: classes.testButton }}
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleTestUrlClick}
            >
              https://www.ericawhiteside.com
            </Button>
            <Button
              classes={{ root: classes.testButton }}
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleTestUrlClick}
            >
              http://maps.co.mecklenburg.nc.us/openmapping/data.html
            </Button>
            <Button
              classes={{ root: classes.testButton }}
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleTestUrlClick}
            >
              https://gisdata-arlgis.opendata.arcgis.com/datasets/osem-data-by-zip
            </Button>
            <Button
              classes={{ root: classes.testButton }}
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleTestUrlClick}
            >
              https://gis-mdc.opendata.arcgis.com/datasets/address-1
            </Button>
          </AccordionDetails>
        </Accordion>
        {trackedSelector.length > 0 && (
          <Fade in={isTrackedSelector} timeout={500}>
            <Card className={classes.valueCard}>
              <CardContent>
                <Typography component="h5" variant="h5">
                  Selected value:
                </Typography>
                <Typography
                  className={classes.valueCardDescription}
                  component="p"
                >
                  {trackedSelector}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={this.handleSubmitTrackingValue}
                >
                  Submit for Tracking
                </Button>
              </CardActions>
            </Card>
          </Fade>
        )}
        {loading === true && (
          <div className={classes.spinner}>
            <CircularProgress />
          </div>
        )}
        <Collapse in={isScrapedHtml} timeout={2000}>
          <Paper className={classes.container}>
            <div className={classes["simulator-wrapper"]}>
              <div
                className="simulator-container"
                dangerouslySetInnerHTML={{ __html: scrapedHtml }}
                onClick={this.handleClick}
              />
            </div>
          </Paper>
        </Collapse>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(AddUrl);
