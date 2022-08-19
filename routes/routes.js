const express = require("express");
const router = express.Router();
// include models in routes
const User = require("../models/users"); //included model into routes // for uploading image from form
const multer = require("multer");

const fs = require("fs");
/* router.get("/",(req,res)=>{
    res.send("Home page")
})
*/
// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb->callback
    cb(null, "./uploads/"); //use uploads directory in the root for storage// all images will be uploaded in the uploads
  },
  filename: function (req, file, cb) {
    //to give filename for upladed file
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});
var upload = multer({
  //upload-> middleware
  storage: storage, //storage:    storage ->variable uses storage
}).single("image");

// insert an user into database route
router.post("/add", upload, (req, res) => {
  //add_users.ejs ma form bata /add routes use bhako
  //'image'->file name attribute value  defined in add user ejs
  // single method single selection
  const user = new User({
    //user-> model
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  user.save((err) => {
    //save is a fxn from mongoose library
    if (err) {
      res.json({ message: err.message, type: "danger" });
    } else {
      req.session.message = {
        type: "success",
        message: "User added successfuly!",
      };
      res.redirect("/"); //redirect to the home page
    }
  });
});

// get all users route
router.get("/", (req, res) => {
  // res.render("index", { title: 'Home Page' })

  User.find().exec((err, users) => {
    if (err) {
      res.json({ message: err.message });
    } else {
      res.render("index", { title: "Home Page", users: users });
    }
  });
});
router.get("/add", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});

// edit an user route
router.get("/edit/:id", (req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    if (err) {
      res.redirect("/"); //redirect to home page
    } else {
      if (user == null) {
        res.redirect("/");
      } else {
        res.render("edit_users", {
          title: "Edit users",
          user: user,
        });
      }
    }
  });
});
// update an user route
router.post("/update/:id", upload, (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename; //assign and then remove
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image; //if image not want to change
  }

  User.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: "danger" });
      } else {
        req.session.message = {
          type: "success",
          message: "User updated sucessfully!",
        };
        res.redirect("/"); //after updating we redirect the file
      }
    }
  );
});

// Delete user route
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id, (err, result) => {
    if (result.image != "") {
      //if image is not empty
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (err) {
        console.log(err);
      }
    }

    if (err) {
      res.json({ message: err.message });
    } else {
      req.session.message = {
        type: "info",
        message: "User deleted successfully!",
      };
      res.redirect("/"); //after updating we redirect the file
    }
  });
});
module.exports = router;
