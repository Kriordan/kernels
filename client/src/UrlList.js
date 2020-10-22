import React from "react";

import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@material-ui/core";

const styles = (theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  textGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  textGroupTitle: {
    marginRight: "20px",
  },
  textGroupCopy: {
    display: "inline-block",
    maxWidth: "500px",
  },
});

class UrlList extends React.Component {
  state = {
    urls: [],
  };

  componentDidMount() {
    this.getUrls();
  }

  getUrls = () => {
    fetch("/api/v1/urls", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        this.setState({ urls: [...data] });
      });
  };

  deleteUrl = (id) => {
    fetch(`/api/v1/urls/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        this.getUrls();
      });
  };

  render() {
    const { classes } = this.props;
    const { urls } = this.state;

    const updatedUrls = urls.filter((url) => url.value_updated);
    const notUpdatedUrls = urls.filter((url) => !url.value_updated);

    return (
      <React.Fragment>
        {urls.length === 0 ? (
          <Typography>No Urls Being Tracked</Typography>
        ) : (
          urls.map((url) => (
            <Card key={url.id} classes={{ root: classes.root }}>
              <CardContent>
                <div className={classes.textGroup}>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    className={classes.textGroupTitle}
                  >
                    URL
                  </Typography>
                  <Typography noWrap={true} className={classes.textGroupCopy}>
                    {url.url}
                  </Typography>
                </div>
                <div className={classes.textGroup}>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    className={classes.textGroupTitle}
                  >
                    Last Scraped
                  </Typography>
                  <Typography className={classes.textGroupCopy}>
                    {new Date(url.last_scraped_date).toDateString()}
                  </Typography>
                </div>
                <div className={classes.textGroup}>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    className={classes.textGroupTitle}
                  >
                    Tracked Value
                  </Typography>
                  <Typography className={classes.textGroupCopy}>
                    {url.value}
                  </Typography>
                </div>
                <div className={classes.textGroup}>
                  <Typography
                    variant="subtitle2"
                    display="inline"
                    className={classes.textGroupTitle}
                  >
                    Value Updated
                  </Typography>
                  <Typography className={classes.textGroupCopy}>
                    {`${url.value_updated}`}
                  </Typography>
                </div>
              </CardContent>
              <CardActions>
                <Button onClick={() => this.deleteUrl(url.id)}>Delete</Button>
              </CardActions>
            </Card>
          ))
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(UrlList);
