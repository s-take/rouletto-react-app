import React, { useRef, useState } from "react";
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
  const [personList, setPersonList] = useState<PersonData[]>([]);
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

  // funcions
  const sliceByLength = (array: string | any[], length: number) => {
    const number = Math.round(array.length / length);
    return new Array(length)
      .fill(null)
      .map((_, i) =>
        array.slice(
          i * number,
          i === length - 1 ? array.length : (i + 1) * number
        )
      );
  };

  const shuffleList = () => {
    // setData(shuffle(personList.map((v) => v.option)));
    setTeams(sliceByLength(shuffle(personList.map((v) => v.option)), teamNum));
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

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handlePersonAddEvent = () => {
    if (userName === "") {
      setInputError(true);
      setInputErrorText("入力必須です");
      return;
    } else if (
      personList.findIndex(({ option }) => option === userName) !== -1
    ) {
      setInputError(true);
      setInputErrorText("同じ名前が存在します");
      return;
    }
    setPersonList([...personList, { option: userName }]);
    setUserName("");
    setInputError(false);
    setInputErrorText("");
  };

  const handleDeletePerson = (index: number) => {
    const newPersonList = [...personList];
    newPersonList.splice(index, 1);
    setPersonList(newPersonList);
  };

  const handleSpinClick = () => {
    const newPrizeNumber = Math.floor(Math.random() * personList.length);
    setPrizeNumber(newPrizeNumber);
    setMustSpin(true);
    setConfetti(false);
  };

  const reset = () => {
    setPersonList([]);
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

          <Grid xs={8} justifyContent="center">
            <Demo>
              <List>
                {personList.map((value, i) => {
                  return (
                    <ListItem
                      divider={true}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeletePerson(i)}
                        >
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
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
              >
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    onClick={startRouletto}
                    sx={{ mr: 2 }}
                  >
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
                  <Button
                    variant="contained"
                    onClick={shuffleList}
                    sx={{ ml: 2 }}
                  >
                    GO!
                  </Button>
                </Grid>
                {teams.map((team: any, teamIndex: number) => (
                  <>
                    <Grid item xs={12}>
                      <h3>チーム{teamIndex + 1}</h3>
                    </Grid>
                    {team.map((d: any) => (
                      <Grid item xs={4}>
                        <Paper
                          sx={{
                            m: 1,
                            backgroundColor: backgroundColors[teamIndex],
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
          </TabContext>
        </Grid>
      </Grid>
      {confetti && <Confetti width={width} height={height} recycle={false} />}
    </React.Fragment>
  );
}
