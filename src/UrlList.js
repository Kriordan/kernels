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

  handleDelete = (id) => {
    console.log(id);
    fetch(`/api/v1/urls/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        this.getUrls();
      });
  };

  render() {
    const { classes } = this.props;
    const { urls } = this.state;

    return (
      <React.Fragment>
        {urls.length === 0 ? (
          <Typography>No Urls Being Tracked</Typography>
        ) : (
          urls.map((url) => (
            <Card key={url.id} classes={{ root: classes.root }}>
              <CardContent>
                <Typography>{url.url}</Typography>
                <Typography>{url.value}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => this.handleDelete(url.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          ))
        )}
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(UrlList);
