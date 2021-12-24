import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { CryptoState } from "../../CryptoContext";
import { Avatar } from "@material-ui/core";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from "../CoinsTable";
import { doc, setDoc } from "firebase/firestore";
import { AiFillDelete } from "react-icons/ai";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  profile: {
    flex: 1,
    height: "92%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "black",
    color: "white",
    objectFit: "contain",
  },
  logout: {
    height: "5%",
    width: "100%",
    backgroundColor: "black",
    color: "white",
    marginTop: 20,
    "&:hover": {
      backgroundColor: "#262626",
    },
  },
  tracklist: {
    flex: 1,
    width: "100%",
    borderRadius: 5,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflow: "auto",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "black",
    color: "white",
    boxShadow: "0 0 3px black",
  },
});

export default function UserSidebar() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, tracklist, coins, symbol } = CryptoState();

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const removeFromTracklist = async (coin) => {
    const coinRef = doc(db, "tracklist", user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: tracklist.filter((track) => track !== coin?.id),
        },
        { merge: "true" }
      );

      setAlert({
        open: true,
        message: `${coin.name} Removed from the Tracklist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
      return;
    }
  };

  const logOut = () => {
    signOut(auth);

    setAlert({
      open: true,
      message: "Logout Successful",
      type: "success",
    });

    toggleDrawer();
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar onClick={toggleDrawer(anchor, true)} style={{ height: 38, width: 38, cursor: "pointer", color: "black" }} src={user.photoURL} alt={user.displayName || user.email} />
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar className={classes.picture} src={user.photoURL} alt={user.displayName || user.email} />
                <span style={{ width: "100%", fontSize: 25, textAlign: "center", fontWeight: "bolder", wordWrap: "break-word" }}>{user.displayName || user.email}</span>
                <div className={classes.tracklist}>
                  <span style={{ fontSize: 18, marginTop: 10, marginBottom: 10 }}>Tracklist </span>

                  {coins.map((coin) => {
                    if (tracklist.includes(coin.id))
                      return (
                        <div className={classes.coin}>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol} {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete style={{ cursor: "pointer" }} fontSize="16" onClick={() => removeFromTracklist(coin)} />
                          </span>
                        </div>
                      );
                    else return <></>;
                  })}
                </div>
              </div>
              <Button variant="contained" className={classes.logout} onClick={logOut}>
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
