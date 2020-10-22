import React, { useState } from "react";

import { withStyles } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing(1),
  },
  form: {
    margin: "50px auto",
    maxWidth: "500px",
    textAlign: "center",
  },
});

function UrlScrapeForm(props) {
  const { classes, scrapeUrl } = props;

  const [url, setUrl] = useState("");

  function handleFormSubmit(e) {
    e.preventDefault();
    scrapeUrl(url);
  }

  return (
    <form onSubmit={handleFormSubmit} className={classes.form}>
      <TextField
        fullWidth
        label="Enter url"
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://catalog.data.gov/dataset/road"
        variant="outlined"
        value={url}
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
  );
}

export default withStyles(styles)(UrlScrapeForm);
