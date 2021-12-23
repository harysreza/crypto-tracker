import { CircularProgress, makeStyles, MenuItem, Select } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { HistoricalChart } from "../config/api";
import { chartDays } from "../config/data";
import { CryptoState } from "../CryptoContext";
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();

  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  const classes = useStyles();

  const fetchHistoricData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));

    setHistoricData(data.prices);
  };

  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  return (
    <div className={classes.container}>
      {!historicData ? (
        <CircularProgress style={{ color: "black" }} size={250} thickness={1} />
      ) : (
        <>
          <Select variant="outlined" style={{ width: 120, height: 40, alignSelf: "start", marginLeft: 80 }} value={chartDays.value} defaultValue={"1"} onChange={(e) => setDays(e.target.value)}>
            <MenuItem value={"1"}>24 Hours</MenuItem>
            <MenuItem value={"30"}>30 Days</MenuItem>
            <MenuItem value={"90"}>3 Months</MenuItem>
            <MenuItem value={"365"}>1 Year</MenuItem>
          </Select>

          <Line
            data={{
              labels: historicData.map((coin) => {
                let date = new Date(coin[0]);
                let time = date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                return days === 1 ? time : date.toLocaleDateString();
              }),

              datasets: [
                {
                  data: historicData.map((coin) => coin[1]),
                  label: `Price in ${currency}`,
                  fill: false,
                  borderColor: "#000080",
                  backgroundColor: "#3333ff",
                },
              ],
            }}
            options={{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </>
      )}
    </div>
  );
};

export default CoinInfo;
