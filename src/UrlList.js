import React from "react";

import { Card, CardContent, Typography } from "@material-ui/core";

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

  render() {
    const { urls } = this.state;

    return (
      <React.Fragment>
        {urls.length === 0 ? (
          <h1>No Urls Being Tracked</h1>
        ) : (
          urls.map((url, index) => (
            <Card key={index}>
              <CardContent>
                <Typography>{url.url}</Typography>
                <Typography>{url.value}</Typography>
              </CardContent>
            </Card>
          ))
        )}
      </React.Fragment>
    );
  }
}

export default UrlList;
