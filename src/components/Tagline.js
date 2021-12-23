import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  tagline: {
    display: "flex",
    height: "40%",
    flexDirection: "column",
    justifyContent: "center",
    textAlign: "center",
  },
}));

const Tagline = () => {
  const classes = useStyles();

  return (
    <div className={classes.tagline}>
      {/* <Typography variant="h2" style={{ fontWeight: "bold", marginBottom: 20, fontFamily: "Montserrat", marginTop: 50 }}>
        Crypto Tracker
      </Typography> */}
      <Typography
        variant="h2"
        style={{
          color: "black",
          fontWeight: "500",
          textTransform: "capitalize",
          fontFamily: "Montserrat",
          marginTop: 80,
          marginBottom: 80,
        }}
      >
        discover your crypto
      </Typography>
    </div>
  );
};

export default Tagline;
