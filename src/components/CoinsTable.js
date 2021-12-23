import { Container, LinearProgress, makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, MenuItem, Select } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const CoinsTable = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const { currency, setCurrency, symbol } = CryptoState();

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSearch = () => {
    return coins.filter((coin) => coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search));
  };

  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
      borderBottom: "2px solid #666666",
    },
    thead: {
      "& th:first-child": {
        borderRadius: "5px 0 0 5px",
      },
      "& th:last-child": {
        borderRadius: "0 5px 5px 0",
      },
      height: 70,
    },
  });

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const classes = useStyles();
  return (
    <Container style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <TextField
          label="Search Crypto"
          variant="outlined"
          style={{ marginBottom: 20, marginTop: 30, width: "20%" }}
          onChange={(e) => {
            setSearch(e.target.value);
            handlePageChange({ selected: 1 });
          }}
        />
        <Select variant="outlined" style={{ width: 100, height: 56, marginBottom: 20, marginTop: 30, marginLeft: 10 }} value={currency} onChange={(e) => setCurrency(e.target.value)}>
          <MenuItem value={"USD"}>USD</MenuItem>
          <MenuItem value={"EUR"}>EUR</MenuItem>
          <MenuItem value={"IDR"}>IDR</MenuItem>
        </Select>
      </div>

      <TableContainer>
        {loading ? (
          <LinearProgress style={{ backgroundColor: "black" }} />
        ) : (
          <Table>
            <TableHead className={classes.thead} style={{ backgroundColor: "#1a1a1a" }}>
              <TableRow>
                {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                  <TableCell style={{ color: "#d9d9d9", fontWeight: "700", fontFamily: "Montserrat" }} key={head} align={head === "Coin" ? "" : "right"}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {handleSearch()
                .slice((page - 1) * 10, (page - 1) * 10 + 10)
                .map((row) => {
                  const profit = row.price_change_percentage_24h > 0;

                  return (
                    <TableRow style={{ backgroundColor: "#d9d9d9" }} onClick={() => navigate(`/coins/${row.id}`)} className={classes.row} key={row.name}>
                      <TableCell component="th" scope="row" style={{ display: "flex", gap: 15 }}>
                        <img src={row?.image} alt={row.name} height="50" style={{ marginBottom: 10 }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span
                            style={{
                              textTransform: "uppercase",
                              fontSize: 22,
                            }}
                          >
                            {row.symbol}
                          </span>
                          <span style={{ color: "black" }}>{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell align="right">
                        {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                      </TableCell>
                      <TableCell
                        align="right"
                        style={{
                          color: profit > 0 ? "#009900" : "#b30000",
                          fontWeight: 500,
                        }}
                      >
                        {profit && "+"}
                        {row.price_change_percentage_24h.toFixed(2)}%
                      </TableCell>
                      <TableCell align="right">
                        {symbol} {numberWithCommas(row.market_cap.toString().slice(0, -6))}M
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <Pagination
        style={{
          padding: 20,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
        count={(handleSearch()?.length / 10).toFixed(0)}
        onChange={(_, value) => {
          setPage(value);
          window.scroll(0, 0);
        }}
      />
    </Container>
  );
};

export default CoinsTable;
