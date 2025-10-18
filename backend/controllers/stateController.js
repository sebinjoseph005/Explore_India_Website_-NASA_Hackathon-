import fs from "fs";

const states = JSON.parse(fs.readFileSync("./data/states.json", "utf-8")).states;

export const getStates = (req, res) => {
  res.json(states);
};
