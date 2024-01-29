var highlight = document.querySelector(".highlight");

let verticalF = 280.93;
let horizontalF = 403;

let smallJumpH = 57.985;
let bigJumpH = 158.75;
let jumpV = 104.9;

let testC = 2;
let testR = 0;
let testS = 2;

let x;
let y;
let z;

y = testC;
z = testR;
x = testS + 2 * testC;

highlight.style.top = verticalF + jumpV * z + "px";
highlight.style.left = horizontalF + smallJumpH * x + bigJumpH * y + "px";

let count = 0;
let roomNo = 201;
let students = 1;
let maxStuStr = 107;
while (students < maxStuStr) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 3; k = k + 2) {
        console.log("[" + i + " " + j + " " + k + "]");
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
