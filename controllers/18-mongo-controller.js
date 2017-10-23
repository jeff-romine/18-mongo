var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
mongoose.Promise = Promise;
var Article = require("../models/article");
var request = require("request");
var cheerio = require("cheerio");



router.get("/all", (req, res) => {

  Article.find({}).exec((err,articles) => {
    if (err) {
      console.error("error in /all: " + err);
    }
    else {
      console.log(JSON.stringify(articles,null,2));
      res.json(articles);
    }
  });
});


router.get("/", (req,res)  => {

  request("https://www.nytimes.com", function(error, response, html) {

    var $ = cheerio.load(html);

    var articles = [];

    $("#top-news article .story-heading").slice(0,20).each(function(i, element) {

      var headline = $(element).text().trim();

      var url = $(element).find("a").attr("href");

    articles.push({
        i: i,
        headline: headline,
        url: url
      });
    });

    console.log(JSON.stringify(articles,null,2));

    res.render("index", {articles: articles});
  });
});
// app.post("/submit", function (req, res) {

//   var article = new Article(req.body);

//   // save a article to our mongoDB
//   article.save(function (error, doc) {
//     // send an error to the browser
//     if (error) {
//       res.send(error);
//     }
//     // or send the doc to our browser
//     else {
//       res.send(doc);
//     }
//   });
// });

// router.get("/search", function (req, res) {
//     db.Character.findAll({
//       order: [sequelize.col("house"),sequelize.col("dateOfBirth"),sequelize.col("name")]

//     }).then(function (characters) {
//           res.render("index", {characters: characters});
//       });
//   });

// // Create all our routes and set up logic within those routes where required.
// router.get("/search/:search?", function (req, res) {
//   const search=req.params.search;

//   if (search && (search.length > 0)) {

//     var query = [
//       "SELECT * FROM Characters WHERE MATCH (name,house,mother,father,titles,books)",
//       "AGAINST ('" + search + "' IN BOOLEAN MODE)"
//     ].join("\n");

//     db.sequelize.query(query,{type: db.sequelize.QueryTypes.SELECT})
//       .then(function (characters) {
//         res.render("index", {characters: characters});
//       });
//   }
//   else {
//     res.render("index", {characters: []});
//   }
// });


// router.post("/search/:search?", function (req, res) {
//   console.log(JSON.stringify(req.body,null,2));
//   const searchTerms = req.body.searchTerms;
//     res.redirect("/search/" + (searchTerms || ""));
// });

// // New get for the character page.
// router.get("/character/:name", function (req, res) {
//     db.Character.findOne({
//         where: {
//             name: req.params.name
//         }
//     }).then(function (character) {
//         console.log(JSON.stringify(character, null, 2));
//         res.render("character", { character: character });
//     });
// });

// // Edit Character route.
// router.get("/character/edit/:name", function (req, res) {
//     db.Character.findOne({
//         where: {
//             name: req.params.name
//         }
//     }).then(function (character) {
//         res.render("edit", { character: character });
//     });
// });

// router.post("/", function (req, res) {
//     // db.Burger.create({burger_name: req.body.burger_name})
//     //     .then(() => res.redirect("/"));
// });


// // PUT to update a character.
// router.put("/character/update/:name", function (req, res) {
//     console.log("THIS IS REQ.BODY" , req.body);
//     var address = req.body.imageLink;
//     var includes = address.includes("https://api.got.show/https:");
//     var image_Link = includes ? address.split("https://api.got.show/") : address;

//     db.Character.update({
//         titles: req.body.titles,
//         house: req.body.house,
//         mother: req.body.mother,
//         father: req.body.father,
//         books: req.body.books,
//         description: req.body.description,
//         imageLink: image_Link
//     },
//     {
//         where: {
//             name: req.params.name
//         }
//     }).then(() => res.redirect("/character/" + req.params.name));

// });

// router.delete("/:id", function (req, res) {
//     // burger.delete(
//     //     req.params.id,
//     //     () => res.redirect("/"));
// });

// // Route for contact us page.
// router.get("/contactUs", function(req, res){
//     res.render('contactUs',{});
// })

// // Router for learn more page.
// router.get("/learnMore", function(req, res){
//     res.render('learnMore',{});
// })

// // Router for the Profile Page.
// router.get("/profile", function(req, res){
//     res.render('profile', {first_name : req.session.first_name || 'no name', email : req.session.email});
// });

// router.post("/logout", function(req, res){
//     req.logout();
//     req.session.destroy();
//     res.redirect('/login.html');
// })

// router.post('/login/register', login.register)
// router.post('/login/sign_in', login.login)

// function authenticationMiddleware () {
//   return (req, res, next) => {
//     console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

//       if (req.isAuthenticated()) return next();
//       res.redirect('/login.html');
//   }
// }

// Export routes for server.js to use.
module.exports = router;
