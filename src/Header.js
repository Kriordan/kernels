import React from "react";
import { Link as RouterLink } from "@reach/router";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "@material-ui/core/Link";
import Icon from "@material-ui/core/Icon";

import logo from "./squeegee.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: "20px",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  link: {
    marginRight: theme.spacing(4),
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Link
            className={classes.link}
            component={RouterLink}
            color="inherit"
            underline="none"
            variant="h4"
            to="/"
          >
            <Icon fontSize="large">
              <img src={logo} alt="" />
            </Icon>
          </Link>
          <Link
            className={classes.link}
            component={RouterLink}
            color="inherit"
            underline="none"
            to="/urls"
          >
            My Urls
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}
