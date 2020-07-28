import React from "react";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  container: {
    padding: theme.spacing(5, 5, 10, 5),
  },
  button: {
    display: "block",
    marginTop: theme.spacing(1),
  },
  targetSiteIframe: {
    minHeight: "600px",
    margin: "auto",
    width: "100%",
  },
});

class AddUrl extends React.Component {
  state = {
    inputUrl: "https://www.keithriordan.com",
    scrapedCss: "",
    scrapedHtml: "",
    trackingDomNode: "",
    url: "https://www.keithriordan.com",
    users: [],
  };

  componentDidMount() {
    console.log("componentdidmount");
  }

  postUrl = () => {
    console.log("fromposturl");
    const { inputUrl } = this.state;

    fetch("/api/scrapePage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: inputUrl }),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        this.setState({
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
        console.log(this.state.scrapedCss);
        this.getGeneratedPageURL({
          html: data.htmlResponses[0],
          css: "",
          js: 'console.log("From the blob");',
        });
      });
  };

  getGeneratedPageURL = ({ html, css, js }) => {
    const getBlobURL = (code, type) => {
      const blob = new Blob([code], { type });
      return URL.createObjectURL(blob);
    };

    const cssURL = getBlobURL(css, "text/css");
    const jsURL = getBlobURL(js, "text/javascript");

    const source = `
      <html>
        <head>
          ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
          ${js && `<script src="${jsURL}"></script>`}
        </head>
        <body>
          ${html || ""}
        </body>
      </html>
    `;

    this.setState({ url: getBlobURL(source, "text/html") });
  };

  handleInput = (e) => {
    this.setState({ inputUrl: e.target.value });
  };

  createDangerousMarkup = () => {
    return { __html: this.scrapedHtml };
  };

  render() {
    const { classes } = this.props;
    const { url, inputUrl, scrapedHtml } = this.state;

    return (
      <Paper className={classes.container}>
        <iframe
          src={url}
          className={classes.targetSiteIframe}
          frameBorder="1"
          title={url}
          ref={this.iframeRef}
        ></iframe>
        <TextField
          label="Enter url"
          variant="outlined"
          value={inputUrl}
          fullWidth
          onInput={this.handleInput}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={this.postUrl}
        >
          Submit
        </Button>
        <div
          className="simulator-container"
          dangerouslySetInnerHTML={{ __html: scrapedHtml }}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(AddUrl);
