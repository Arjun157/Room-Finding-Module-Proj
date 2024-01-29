const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); // Import the 'path' module
const mongoose = require("mongoose");
const { info } = require("console");
const { clearCache } = require("ejs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

app.set("views", "../frontEnd/views");
app.set("view engine", "ejs");

app.use(express.static("../frontEnd/public"));

mongoose.connect("mongodb://127.0.0.1:27017/WtMiniDB", {
  useNewUrlParser: true,
});

const studentPlaceSchema = new mongoose.Schema({
  column: Number,
  row: Number,
  seat: Number,
});

const studentSchema = new mongoose.Schema({
  SRN: String,
  name: String,
  semester: Number,
  year: Number,
  program: String,
  branch: String,
  roomNo: String,
  seating: [studentPlaceSchema],
});

const Student = mongoose.model("student", studentSchema);

let count = 0;
let roomNo = 201;
let students = 1;
let maxStuStr;

const updateAllStudents = async () => {
  const allStudents = await Student.find();
  // console.log(allStudents);
  maxStuStr = allStudents.length;

  while (students < maxStuStr) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 3; k = k + 2) {
          console.log("[" + i + " " + j + " " + k + "]");

          let newRoomNo = roomNo;
          let newSeating = [{ column: i, row: j, seat: k }];

          await Student.updateOne(
            { name: allStudents[students - 1].name },
            { $set: { roomNo: newRoomNo, seating: newSeating } }
          )
            .then((result) => {
              console.log("Student updated successfully:");
            })
            .catch((err) => {
              console.error("Error updating student:", err);
            });
          console.log(allStudents[students - 1]);
          students++;

          if (students > maxStuStr) {
            console.log(students);
            break;
          }
        }
        count = count + 3;
        if (students > maxStuStr) {
          break;
        }
      }
      if (count > 34) {
        count = 0;
        roomNo++;
      }
      if (students > maxStuStr) {
        break;
      }
    }
  }
};

// updateAllStudents();

// const student = new Student({
//   SRN: "R21EF284",
//   name: "Bhuvan U",
//   semester: 5,
//   year: 3,
//   branch: "Btech",
//   class: 201,
//   seating: [
//     {
//       column: 0,
//       row: 3,
//       seat: 0,
//     },
//   ],
// });

// student.save();

let SRN = null;

app.get("/", function (req, res) {
  res.render("index", {});
});

function someAsyncOperation(SRN) {
  return new Promise((resolve, reject) => {
    Student.find({})
      .then((results) => {
        let info = null;
        for (let i = 0; i < results.length; i++) {
          if (results[i].SRN === SRN) {
            info = results[i];
            break;
          }
        }
        resolve(info);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

let verticalF = 220;
let horizontalF = 43;

let smallJumpH = 57.985;
let bigJumpH = 158.75;
let jumpV = 104.9;

let x;
let y;
let z;

let visibility = "hidden";

app.get("/profile", async function (req, res) {
  try {
    SRN = req.query.SRN;
    let info = null;
    info = await someAsyncOperation(SRN);

    if (info !== null) {
      const [{ column, row, seat, _id }] = info.seating;
      let seatingA = "C : " + column + "; R : " + row + "; S : " + seat + ";";

      y = column;
      z = row;
      x = seat + 2 * column;

      let top = verticalF + jumpV * z + "px";
      let left = horizontalF + smallJumpH * x + bigJumpH * y + "px";
      res.render("profile", {
        SRN: info.SRN,
        name: info.name,
        semester: info.semester,
        year: info.year,
        branch: info.branch,
        top: top,
        left: left,
        visibility: visibility,
        className: info.roomNo,
        seatingA: seatingA,
      });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/", async function (req, res) {
  // console.log(req.body);
  SRN = req.body.SRN;
  // res.redirect("profile");
  res.redirect(`/profile?SRN=${SRN}`);
});

app.post("/profile", async function (req, res) {
  let buttonType = req.body.buttonType;

  if (buttonType === "Back To Home") res.redirect(`/`);
  if (buttonType === "Class Top View") {
    visibility = "visible";
    res.redirect(`/profile?SRN=${SRN}`);
  }
  if (buttonType === "Back") {
    visibility = "hidden";
    res.redirect(`/profile?SRN=${SRN}`);
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
