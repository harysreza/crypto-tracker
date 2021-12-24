import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { CoinList } from "./config/api";
import { auth, db } from "./firebase";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("IDR");
  const [symbol, setSymbol] = useState("Rp");
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [tracklist, setTracklist] = useState([]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "tracklist", user.uid);

      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setTracklist(coin.data().coins);
        } else {
          console.log("No Items in Tracklist");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currency === "IDR") setSymbol("Rp");
    else if (currency === "USD") setSymbol("$");
    else if (currency === "EUR") setSymbol("€");

    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return <Crypto.Provider value={{ currency, symbol, setCurrency, alert, setAlert, user, tracklist, coins, loading }}>{children}</Crypto.Provider>;
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
