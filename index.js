// index.js
/* 
  This script renders main.mustache file with berkslv's medium feeds 3 posts.
*/
const Mustache = require("mustache");
const axios = require("axios");
const fs = require("fs");

const MUSTACHE_MAIN_DIR = "./main.mustache";
const MEDIUM_POSTS_URL =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@berkslv";

function getMediumFeedItems(items, result) {
  if (items.length >= 3) {
    for (let i = 0; i < 3; i++) {
      let item = {
        title: items[i].title,
        link: items[i].link,
        thumbnail: items[i].thumbnail,
      };
      result.push(item);
    }
  } else {
    for (let i = 0; i < items.length; i++) {
      let item = {
        title: items[i].title,
        link: items[i].link,
        thumbnail: items[i].thumbnail,
      };
      result.push(item);
    }
  }
}

async function getMediumFeed() {
  let mediumFeed = [];

  await axios
    .get(MEDIUM_POSTS_URL)
    .then(function (response) {
      // handle success
      if (response.data.status === "ok") {
        getMediumFeedItems(response.data.items, mediumFeed);
      }
    })
    .catch(function (error) {
      console.error(error);
    });

  generateReadMe(mediumFeed);
}

function generateReadMe(blogFeed) {
  let DATA = {
    blogFeed,
  };

  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync("README.md", output);
  });
}

getMediumFeed();
