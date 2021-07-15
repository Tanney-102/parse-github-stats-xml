const express = require("express");
const asyncify = require('express-asyncify');
const cors = require("cors");
const axios = require("axios");
const { JSDOM } = require("jsdom");

const app = asyncify(express());
app.set("port", process.env.PORT || 3000);
app.use(cors());
app.use(express.json());

const statsId = { 
  stars: "stars",
  commits: "commits",
  prs: "prs", 
  issues: "issues",
  contributes: "contribs"
};

app.get("/github-stats", async (req, res) => {
  try {
    const response = await axios.get("https://github-readme-stats.vercel.app/api?username=tanney-102");
    const githubStatsDOM = new JSDOM(response.data);
    const stats = Object.keys(statsId).reduce((acc, key) => ({
      ...acc,
      [key]: githubStatsDOM.window.document.querySelector(`text[data-testid=${statsId[key]}`)?.textContent ?? "0",
    }), {});

    res.status(200).json(stats);
  } catch (error) {
    res.status(error?.response?.status ?? 500)
  }
});

app.listen(app.get("port"), () => {
  console.log(`App is listening on port ${app.get("port")}`);
});
