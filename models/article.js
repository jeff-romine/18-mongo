// Require mongoose
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// new Schema: ArticleSchema
var ArticleSchema = new Schema({
    url: {
      type: String,
      trim: true,
      required: "URL is required"
    },
    headline: {
      type: String,
      trim: true,
      required: "Headline is required"
    },
    summary: {
      type: String,
      trim: true
    },
    saved: {
      type: Boolean,
      default: false
    }
  },

  {timestamps: true});

// Use the above schema to make the Article model
var Article = mongoose.model("Article", ArticleSchema);

// Export the model so the server can use it
module.exports = Article;
