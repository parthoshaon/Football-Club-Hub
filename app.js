var bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
express = require("express"),
expressSanitizer = require("express-sanitizer"),
app = express();



//app config
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());

//mongoose/model config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/restful_blog_app");

var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date}
});

var Blog = mongoose.model("Blog", blogSchema);


// routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});



app.get("/blogs", function(req, res) {
	const axios = require('axios');
	//const apiKey = '262a8f5f0b7245a3a2742a448403349d';
	//const apiKey = 'c4b72208606840d1a4b90afb3699bdc0';
	const apiKey = 'c999a3ef2b1e4457921e32f67225da93';
	const baseUrl = `https://api.football-data.org/v2/teams/81/matches?status=SCHEDULED`;
	const tableUrl = `https://api.football-data.org/v2/competitions/2014/standings`;
  
	Promise.all([
	  axios.get(baseUrl, { headers: { 'X-Auth-Token': apiKey } }),
	  axios.get(tableUrl, { headers: { 'X-Auth-Token': apiKey } })
	])
	.then(responseArr => {
	  const nextFixture = responseArr[0].data.matches[0];
	  const homeTeam = nextFixture.homeTeam.name;
	  const awayTeam = nextFixture.awayTeam.name;
	  const fixtureDate = new Date(nextFixture.utcDate).toLocaleDateString();
	  const fixtureTime = new Date(nextFixture.utcDate).toLocaleTimeString();
	  const fixtureVenue = nextFixture.venue;
  
	  const tableData = responseArr[1].data.standings[0].table;
  
	  Blog.find({}, function(err, blogs) {
		if (err) {
		  console.log("ERROR!");
		} else {
		  res.render("index", {
			blogs: blogs,
			nextFixture: {
			  homeTeam: homeTeam,
			  awayTeam: awayTeam,
			  fixtureDate: fixtureDate,
			  fixtureTime: fixtureTime,
			  fixtureVenue: fixtureVenue
			},
			tableData: tableData
		  });
		}
	  });
	})
	.catch(error => {
	  console.error(error);
	  Blog.find({}, function(err, blogs) {
		if (err) {
		  console.log("ERROR!");
		} else {
		  res.render("index", { blogs: blogs });
		}
	  });
	});
  });
  






//Create Route
app.post("/blogs", function(req, res){
	Blog.create(req.body.blog, function(err, newblog){
		if(err) {
			res.render("new");
		}
		else {
			console.log(newblog);
			res.redirect("/blogs");
		}
	});
});

//New Route
app.get("/blogs/new", function(req, res) {
	res.render("new");
});

app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundPost){
		if(err) {
			res.redirect("/blogs");
		}
		else {
			res.render("show", {blog:foundPost});
		}
	});
});

app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundPost){
		if(err) {
			res.redirect("/blogs/req.params.id");
		}
		else {
			res.render("edit", {blog:foundPost});
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err) {
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

app.delete("/blogs/:id", function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err){
		res.redirect("/blogs");
	});
});



app.listen(3000, function() {
	console.log("SERVER IS RUNNING");
});