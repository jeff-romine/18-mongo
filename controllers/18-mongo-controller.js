var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
mongoose.Promise = Promise;
var Article = require("../models/article");
var request = require("request");
var cheerio = require("cheerio");

const chainPromises = (promises, promiseCallback, finalCallback) => {
  const promise = promises.pop();
  if (promise) {
    promise.promise.then((result) => {
        promiseCallback(
          result,
          promise.article,
          () => {
            chainPromises(promises, promiseCallback, finalCallback);
          });
      }
    );
  }
  else {
    finalCallback();
  }
}

const promiseCallback = (article, articleData, callback) => {
  if (!article) {
    var newArticle = new Article(articleData);
    newArticle.save()
      .then((article) => {
        console.log("article saved: " + JSON.stringify(article, null, 2));
        callback();
      })
      .catch((error) => {
        console.error("unable to save article", articleData, error);
        callback();
      });
  }
  else {
    callback();
  }
}

const scrape = (finalCallback) => {
  request("https://www.nytimes.com", (error, response, html) => {

    if (error) {
      console.error("error", error);
      finalCallback();
      return;
    }

    var $ = cheerio.load(html);
    var promises = [];
    $("#top-news article").slice(0, 30).each((i, element) => {
      var $storyHeading = $(element).find(".story-heading");
      var headline = $storyHeading.text().trim();

      var url = $storyHeading.find("a").attr("href");

      var $summary = $(element).find(".summary");

      var summary = $summary.text();

      var promise = {
        promise: Article.findOne({headline: headline}).exec(),
        article: {
          headline: headline,
          url: url,
          summary: summary
        }
      };
      promises.push(promise);
    });
    console.log(promises);
    chainPromises(promises, promiseCallback, finalCallback);
  });
}

router.get("/", (req, res) => {
  Article
    .find({saved: false})
    .limit(20)
    .sort('-createdAt')
    .then((articles) => {
        res.render("index", {articles: articles});
      }
    );
});

router.get("/saved", (req, res) => {
  Article
    .find({saved: true})
    .limit(20)
    .sort('-updatedAt')
    .then((articles) => {
        res.render("saved", {articles: articles});
      });
});

router.get("/scrape", (req, res) => {
  scrape(() => res.redirect("/"));
});

router.put("/save/:id", (req, res) => {
  "use strict";
  const id = req.params.id;
  console.log("id:", id);

  Article.findByIdAndUpdate(id, {saved: true}).then(
    (result) => {
      console.log("saved", result);
      res.redirect("/");
    }
  ).catch((err) => {
    console.log("unable to update article with id=", id);
    res.redirect("/");
  });
});

router.put("/unsave/:id", (req, res) => {
  "use strict";
  const id = req.params.id;
  console.log("id:", id);

  Article.findByIdAndUpdate(id, {saved: false}).then(
    (result) => {
      console.log("saved", result);
      res.redirect("/saved");
    }
  ).catch((err) => {
    console.log("unable to update article with id=", id);
    res.redirect("/saved");
  });
});

module.exports = router;

