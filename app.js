//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();

const homeStartingContent = "This personal project represents a blog creation platform prototype I developed, designed to showcase the sophisticated capabilities of Express.js, a JavaScript framework custom-tailored for streamlining web application development. As part of this endeavor, I seamlessly integrated a feature to persistently store newly authored blog posts within a MongoDB database, significantly enhancing the application's functionality while ensuring the integrity and security of user-generated content. Additionally, I utilized Bootstrap to create an elegant and responsive navbar for a seamless user experience.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", async function(req, res) {
  try {
    const posts = await Post.find({}).exec();
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving post");
  }
});

app.get("/posts/:postId", async function(req, res){
  const requestedPostId = req.params.postId;

  try {
    const post = await Post.findOne({_id: requestedPostId}).exec();
    res.render("post", {
      title: post.title,
      content: post.content
    });
  } catch (err) {
    console.error(err);
    res.status(404).send("Post not found");
  }
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
