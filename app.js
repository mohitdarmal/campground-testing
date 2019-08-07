const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
var ObjectID = require("mongodb").ObjectID;
const port = process.env.PORT || 3000;


//App Confiig
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(methodOverride("_method"));

// mongodb://localhost:27017/campground
// mongodb+srv://Mohit:<mohit@321>@campground-test-a8kze.mongodb.net/test?retryWrites=true&w=majority
//Mongoose Config
mongoose.connect("mongodb+srv://Mohit:mohit@321@campground-test-a8kze.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true
}, () => {
    console.log("Mongoose Has Connected!!");
});

var campSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    date: {
        type: Date,
        default: Date.now
    }
});

var Campground = mongoose.model("Campground", campSchema);

app.get("/", (req, res) => {
    res.redirect("/campground");
});

app.get("/campground", (req, res) => {
    Campground.find({}).then((readData) => {
        if (readData) {
            res.render("index", {
                camp: readData
            });
        }
    });
});

app.post("/campground", (req, res) => {
    var data = req.body.camp;

    var Camp = new Campground(data);
    Camp.save().then((campData) => {
        if (campData) {
            res.redirect("/campground");
        }
    });

    /*   Campground.create(data).then((camp) => {
          if(camp){
              console.log(camp);
          }
      }); */
});

app.get("/campground/new", (req, res) => {
    res.render('new');
});

app.get("/campground/:id", (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.render("back.ejs");
    }

        Campground.findById(id).then((findData) => {
            if (findData) {
                res.render("detail", {
                    camp: findData
                });
            }
        });
});

app.get("/campground/:id/edit", (req, res) => {
    var id = req.params.id;
    Campground.findById(id).then((findData) => {
        if (findData) {
            res.render('edit', {
                camp: findData
            });
        }
    });

});

app.put("/campground/:id", (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp).then((updateData) => {
        if (updateData){
            res.redirect("/campground");           
        }
    });
});

app.delete("/campground/:id", (req, res) => {
    Campground.findByIdAndDelete(req.params.id).then((deleteData) => {
        if(deleteData){
            res.redirect('/campground');
        }
    })
});




app.listen(port, () => {
    console.log(`App Has Started on PORT ${port}!!!`);
});