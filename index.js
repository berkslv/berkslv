// index.js
/* 
  This script renders main.mustache file with berkslv's personal blog feeds 3 posts.
*/
const Mustache = require("mustache");
const axios = require("axios");
const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");

const MUSTACHE_MAIN_DIR = "./main.mustache";
const BLOG_RSS_URL = "https://berkselvi.dev/index.xml";

function getBlogFeedItems(items) {
  const count = Math.min(items.length, 3);
  return items.slice(0, count).map((item) => ({
    title: item.title,
    link: item.link,
  }));
}

async function getBlogFeed() {
  let blogFeed = [];

  await axios
    .get(BLOG_RSS_URL)
    .then(function (response) {
      const parser = new XMLParser();
      const result = parser.parse(response.data);
      const items = result.rss.channel.item;
      blogFeed = getBlogFeedItems(Array.isArray(items) ? items : [items]);
    })
    .catch(function (error) {
      console.error(error);
    });

  generateReadMe(blogFeed);
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

getBlogFeed();
