import React, { useEffect, useRef, useState } from "react";
import { Wheel } from "react-custom-roulette";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemText from "@mui/material/ListItemText";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormControl, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import useSound from "use-sound";
import RollSound from "./roll.mp3";
import StopSound from "./stop.mp3";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import shuffle from "lodash.shuffle";
import { Flipper, Flipped } from "react-flip-toolkit";

const backgroundColors = ["#ff8f43", "#70bbe0", "#0b3351", "#A1341B"];
// const backgroundColors = ["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"];
// const backgroundColors = ["#000000", "#FF3232"];
// const backgroundColors = [
//   "#A1341B",
//   "#B3ED58",
//   "#ED6040",
//   "#2860ED",
//   "#2347A1",
// ];
const textColors = ["#FFFFFF"];
// const textColors = ["#0b3351"];
const outerBorderColor = "#eeeeee";
const outerBorderWidth = 10;
const innerBorderColor = "#30261a";
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = "#eeeeee";
const radiusLineWidth = 8;
const fontSize = 19;
const textDistance = 60;

type PersonData = {
  option: string;
};

export default function Roulette() {
  // variables & hooks
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [personList, setPersonList] = useState<PersonData[]>(() => {
    const saved = localStorage.getItem("personList");
    const initialValue = JSON.parse(saved || "[]");
    return initialValue;
  });
  const [userName, setUserName] = useState("");
  // const [roulettoData, setRoulettoData] = useState<RoulettoData[]>([]);

  const [playRollSound, { sound }] = useSound(RollSound);
  const [playStopSound] = useSound(StopSound);

  const { width, height } = useWindowSize();
  const [confetti, setConfetti] = useState(false);

  const processing = useRef(false);
  const inputRef = useRef(null);
  const [inputError, setInputError] = useState(false);
  const [inputErrorText, setInputErrorText] = useState("");

  const [value, setValue] = useState("1");

  const [teamNum, setTeamNum] = useState(1);
  const [teams, setTeams] = useState<any>([]);

  const [data, setData] = useState<string[]>(() => {
    const saved = localStorage.getItem("data");
    const initialValue = JSON.parse(saved || "[]");
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem("personList", JSON.stringify(personList));
  }, [personList]);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  // funcions
  const sliceByLength = (array: string | any[], length: number) => {
    const number = Math.round(array.length / length);
    return new Array(length)
      .fill(null)
      .map((_, i) => array.slice(i * number, i === length - 1 ? array.length : (i + 1) * number));
  };

  const shuffleList = () => {
    // setData(shuffle(personList.map((v) => v.option)));
    setTeams(sliceByLength(shuffle(personList.map((v) => v.option)), teamNum));
  };

  const shufflePerson = () => {
    setData(shuffle(data));
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // const shuffleList = () => setPersonList(shuffle(personList));

  const startRouletto = () => {
    if (processing.current) return;
    processing.current = true;
    handleSpinClick();
    // sound.loop(true);
    playRollSound();
  };

  const startShuffle = async () => {
    setConfetti(false);
    playRollSound();
    for (let i = 0; i < 5; i++) {
      shufflePerson();
      console.log(i);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
    playStopSound();
    setConfetti(true);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handlePersonAddEvent = () => {
    if (userName === "") {
      setInputError(true);
      setInputErrorText("入力必須です");
      return;
    } else if (personList.findIndex(({ option }) => option === userName) !== -1) {
      setInputError(true);
      setInputErrorText("同じ名前が存在します");
      return;
    }
    setPersonList([...personList, { option: userName }]);
    setData([...data, userName]);
    setUserName("");
    setInputError(false);
    setInputErrorText("");
  };

  const handleDeletePerson = (index: number) => {
    const newPersonList = [...personList];
    newPersonList.splice(index, 1);
    setPersonList(newPersonList);
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * personList.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setConfetti(false);
  };

  const reset = () => {
    setPersonList([]);
    setData([]);
  };

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  return (
    <React.Fragment>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={5}>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            候補者を入力してください。
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <FormControl fullWidth>
                  <TextField
                    id="inputPerson"
                    label="候補者"
                    variant="standard"
                    value={userName}
                    onChange={handleUserNameChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.keyCode === 13) {
                        handlePersonAddEvent();
                      }
                    }}
                    error={inputError}
                    inputRef={inputRef}
                    helperText={inputErrorText}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={2} lg={2}>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                  size="large"
                  edge="start"
                  onClick={handlePersonAddEvent}
                >
                  <PersonAddAlt1Icon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            候補者リスト
          </Typography>

          <Grid item xs={8} justifyContent="center">
            <Demo>
              <List>
                {personList.map((value, i) => {
                  return (
                    <ListItem
                      key={value.option}
                      divider={true}
                      secondaryAction={
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDeletePerson(i)}>
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={value.option} />
                    </ListItem>
                  );
                })}
              </List>
            </Demo>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} centered>
                <Tab value="1" label="ルーレット" />
                <Tab value="2" label="チーム決め" />
                <Tab value="3" label="順番決め" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item xs={2}>
                  <Button variant="contained" onClick={startRouletto} sx={{ mr: 2 }}>
                    Go!
                  </Button>
                  <Button variant="contained" onClick={reset}>
                    Reset
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {personList.length > 0 && (
                    <Wheel
                      mustStartSpinning={mustSpin}
                      prizeNumber={prizeNumber}
                      data={personList}
                      backgroundColors={backgroundColors}
                      textColors={textColors}
                      fontSize={fontSize}
                      outerBorderColor={outerBorderColor}
                      outerBorderWidth={outerBorderWidth}
                      innerRadius={innerRadius}
                      innerBorderColor={innerBorderColor}
                      innerBorderWidth={innerBorderWidth}
                      radiusLineColor={radiusLineColor}
                      radiusLineWidth={radiusLineWidth}
                      // perpendicularText
                      textDistance={textDistance}
                      onStopSpinning={() => {
                        sound.loop(false);
                        setMustSpin(false);
                        playStopSound();
                        setConfetti(true);
                        processing.current = false;
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="standard-number"
                    label="チーム数"
                    type="number"
                    // InputLabelProps={{
                    //   shrink: true,
                    // }}
                    defaultValue={1}
                    InputProps={{
                      inputProps: {
                        max: 4,
                        min: 1,
                      },
                    }}
                    variant="standard"
                    style={{ width: 100 }}
                    onChange={(event) => setTeamNum(Number(event.target.value))}
                  />
                  <Button variant="contained" onClick={shuffleList} sx={{ ml: 2 }}>
                    GO!
                  </Button>
                </Grid>
                {teams.map((team: any, teamIndex: number) => (
                  <>
                    <Grid item xs={12}>
                      <h3>チーム{teamIndex + 1}</h3>
                    </Grid>
                    {team.map((d: any) => (
                      <Grid item xs={4} key={d}>
                        <Paper
                          sx={{
                            m: 1,
                            backgroundColor: backgroundColors[teamIndex % 4],
                            color: "white",
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            height: 60,
                            lineHeight: "60px",
                          }}
                        >
                          {d}
                        </Paper>
                      </Grid>
                    ))}
                  </>
                ))}
              </Grid>
            </TabPanel>
            <TabPanel value="3">
              <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item xs={2}>
                  <Button variant="contained" onClick={startShuffle} sx={{ mr: 2 }}>
                    Go!
                  </Button>
                  <Button variant="contained" onClick={reset}>
                    Reset
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Flipper flipKey={data.join("")}>
                    {data.map((d: string, index: number) => (
                      <Flipped key={d} flipId={d}>
                        <Box
                          sx={{
                            width: 250,
                            height: 45,
                            backgroundColor: "#FFF",
                            color: "#6091d3",
                            fontWeight: "bold",
                            borderRadius: 2,
                            border: 3,
                            borderColor: "#6091d3",
                            textAlign: "center",
                            lineHeight: 2.5,
                            mt: 3,
                          }}
                        >
                          {index + 1} : {d}
                        </Box>
                      </Flipped>
                    ))}
                  </Flipper>
                </Grid>
              </Grid>
            </TabPanel>
          </TabContext>
        </Grid>
      </Grid>
      {confetti && <Confetti width={width} height={height} recycle={false} />}
    </React.Fragment>
  );
}
