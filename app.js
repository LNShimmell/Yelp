const express = require("express");
const app = express();
const body_parser = require("body-parser");
app.use(express.static("public"));
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/YelpCamp");
let campSchema = new mongoose.Schema({
  name: String,
  location: String,
  photo: String,
  date: String,
  duration: String
});

let Event = mongoose.model("Event", campSchema);

app.set("view engine", "ejs");
app.use(body_parser.urlencoded({ extended: true }));
// temp variables for testing
let campsites = [
  {
    name: "Yellowknife, Canada",
    photo:
      "https://s1.it.atcdn.net/wp-content/uploads/2016/09/Aurora-at-Blachford-Lake-Lodge02-by-Martina-Gebrovska.jpg"
  },
  {
    name: "Yosemite National Park, California",
    photo:
      "https://backroads-web.s3.amazonaws.com/images/trips/2018/slideshow/WYOI-yosemite-walking-hiking-tour-5.jpg"
  }
];

//temp variables for testing

//landing page
app.get("/", (req, res) => res.render("landing"));

//campgounds page, shows active sites
app.get("/campgrounds", (req, res) => {
  res.render("campgrounds", { campsites });
});
app.post("/campgrounds", (req, res) => {
  //get data from form
  let campsite = { name: req.body.name, photo: req.body.photo };
  if (campsite.name && campsite.photo) {
    // add data to array
    campsites.push(campsite);
    //redirect back to cagrounds page
    res.redirect("campgrounds");
  } //res.render("new");
  else initMap();
});

app.get("/campgrounds/new", (req, res) => {
  res.render("new");
});

app.get("*", (req, res) => res.render("landing"));

//local host port
app.listen(3000, () => console.log("server online"));

var map, infoWindow;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
      },
      function() {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}
