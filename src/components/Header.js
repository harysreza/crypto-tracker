import { AppBar, Container, makeStyles, Toolbar, Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const useStyles = makeStyles(() => ({
    title: {
      flex: 1,
      color: "#d9d9d9",
      fontFamily: "Montserrat",
      fontWeight: "bold",
      cursor: "pointer",
    },
  }));

  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <AppBar style={{ background: "#1a1a1a" }} position="static">
      <Container>
        <Toolbar>
          <Typography className={classes.title} variant="h5" onClick={() => navigate("/")}>
            Crypto Tracker
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
