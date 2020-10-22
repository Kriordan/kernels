import React from "react";

import { Fade, AppBar, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core";

const styles = (theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
    padding: "10px",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  trackingButton: {
    margin: "10px",
  },
  valueCard: {
    margin: "50px auto",
    maxWidth: "500px",
  },
  valueCardDescription: {
    display: "inline-block",
    marginLeft: "10px",
  },
});

function UrlSubmitBar(props) {
  const { classes, isTrackedSelector, trackedSelector, onSubmit } = props;

  function handleSubmit() {
    onSubmit();
  }

  return (
    <Fade in={isTrackedSelector} timeout={500}>
      <AppBar position="fixed" className={classes.appBar}>
        <div className={classes.trackingBarCopy}>
          <Typography
            component="h5"
            variant="h5"
            display="inline"
            color="textPrimary"
          >
            Selected value:
          </Typography>
          <Typography
            className={classes.valueCardDescription}
            component="p"
            variant="body1"
            color="textPrimary"
          >
            {trackedSelector}
          </Typography>
        </div>
        <Button
          className={classes.trackingBarButton}
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSubmit}
        >
          Submit for Tracking
        </Button>
      </AppBar>
    </Fade>
  );
}

export default withStyles(styles)(UrlSubmitBar);
