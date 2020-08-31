import React from "react";

import { CircularProgress } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import UrlScrapeForm from "./UrlScrapeForm";
import UrlSimulator from "./UrlSimulator";
import UrlSubmitBar from "./UrlSubmitBar";

const styles = (theme) => ({
  spinner: {
    display: "flex",
    justifyContent: "center",
    margin: "50px",
  },
});

class UrlScraper extends React.Component {
  state = {
    isScrapedHtml: false,
    isTrackedSelector: false,
    loading: false,
    scrapedCss: "",
    scrapedHtml: "",
    trackedSelector: "",
    trackedXpath: "",
    url: "",
  };

  scrapeUrl = (url) => {
    this.setState({
      url: url,
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
      body: JSON.stringify({ url: url }),
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

  createUrl = () => {
    fetch("/api/v1/urls", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: this.state.url,
        value: this.state.trackedSelector,
        value_xpath: this.state.trackedXpath,
      }),
    })
      .then((data) => data.json())
      .then((data) => console.log(data));
  };

  handleValueSelection = (value, xpath) => {
    this.setState({
      trackedSelector: value
        ? value
        : "This element has no value to track. Please select something else.",
      isTrackedSelector: true,
      trackedXpath: xpath,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      isScrapedHtml,
      isTrackedSelector,
      loading,
      scrapedHtml,
      trackedSelector,
    } = this.state;

    return (
      <React.Fragment>
        <UrlScrapeForm scrapeUrl={this.scrapeUrl}></UrlScrapeForm>
        {loading === true && (
          <div className={classes.spinner}>
            <CircularProgress />
          </div>
        )}
        <UrlSimulator
          isScrapedHtml={isScrapedHtml}
          scrapedHtml={scrapedHtml}
          onValueClick={this.handleValueSelection}
        ></UrlSimulator>
        {trackedSelector.length > 0 && (
          <UrlSubmitBar
            trackedSelector={trackedSelector}
            isTrackedSelector={isTrackedSelector}
            onSubmit={this.createUrl}
          ></UrlSubmitBar>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(UrlScraper);
