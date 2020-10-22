import React from "react";

import { Collapse, Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  container: {
    padding: theme.spacing(5, 5, 10, 5),
  },
  "simulator-wrapper": {
    transform: "translateZ(0)",
  },
});

function UrlSimulator(props) {
  const { classes, isScrapedHtml, scrapedHtml, onValueClick } = props;

  function handleClick(e) {
    e.preventDefault();
    const value = e.target.textContent.trim();
    const xpath = generateXpath(e.target);
    onValueClick(value, xpath);
  }

  function generateXpath(element) {
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
    return segs(element).join("/");
  }

  return (
    <Collapse in={isScrapedHtml} timeout={2000}>
      <Paper className={classes.container}>
        <div className={classes["simulator-wrapper"]}>
          <div
            className="simulator-container"
            dangerouslySetInnerHTML={{ __html: scrapedHtml }}
            onClick={handleClick}
          />
        </div>
      </Paper>
    </Collapse>
  );
}

export default withStyles(styles)(UrlSimulator);
