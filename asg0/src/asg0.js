function main() { 
 // from book
 var canvas = document.getElementById("example");
 if (!canvas) {
   console.log("Failed to retrieve the <canvas> element ");
   return false;
 }
 var ctx = canvas.getContext("2d");
 // https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_canvas_fillstyle
 // https://www.w3schools.com/graphics/canvas_intro.asp
 // q2
 ctx.fillStyle = "black";
 ctx.fillRect(0, 0, 400, 400);
 // expected result q2
 var v1 = new Vector3([2.25, 2.25, 0]);
 // call in main q2
 drawVector(v1, "red");
 // https://www.w3schools.com/js/js_htmldom_eventlistener.asp
 document.getElementById("draw").addEventListener("click", function() {
  handleDrawEvent();
 });
 document.getElementById("drawpick").addEventListener("click", function() {
  handleDrawOperationEvent();
 });
}
// q3 q4
function handleDrawOperationEvent() {
    var canvas = document.getElementById("example");
    var ctx = canvas.getContext("2d");
    // clear canvas
    ctx.clearRect(0, 0, 400, 400);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 400, 400);

    var xc = 0;
    var yc = 0;
    var xc2 = 0;
    var yc2 = 0;
    var pick = 0;
    var scalar = 0;

    // read vals of text boxes create v1 q3 and v2 q4
    xc = document.getElementById("x").value;
    yc = document.getElementById("y").value;
    xc2 = document.getElementById("x2").value;
    yc2 = document.getElementById("y2").value;
    xc = parseFloat(xc);
    yc = parseFloat(yc);
    xc2 = parseFloat(xc2);
    yc2 = parseFloat(yc2);
    // keep z = 0
    var v1 = new Vector3([xc, yc, 0]);
    var v2 = new Vector3([xc2, yc2, 0]);
    // call draw q3 q4
    drawVector(v1, "red");
    drawVector(v2, "blue");
    // not number
    pick = document.getElementById("pick").value;
    // number
    scalar = document.getElementById("scalar").value;
    scalar = parseFloat(scalar);
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
    // interface q5, mag and norm q6
    if (pick === "add") {
        var v3 = v1.add(v2);
        drawVector(v3, "green");

    } else if (pick === "subtract") {
        var v3 = v1.sub(v2);
        drawVector(v3, "green");

    } else if (pick === "multiply") {
        var v3 = v1.mul(scalar);
        var v4 = v2.mul(scalar);
        drawVector(v3, "green");
        drawVector(v4, "yellow");

    } else if (pick === "divide") {
      if (scalar != 0) {
        var v3 = v1.div(scalar);
        var v4 = v2.div(scalar);
        drawVector(v3, "green");
        drawVector(v4, "yellow");
      } else {
        // https://www.w3schools.com/jsref/met_console_log.asp
        console.log("Cannot divide by zero.");
      }
    } else if (pick == "magnitude") {
      // use console.log() from q6
      console.log("Magnitude v1:", v1.magnitude());
      console.log("Magnitude v2:", v2.magnitude());
    } else if (pick == "normalize") {
      v1.normalize();
      v2.normalize();
      // draw in green
      drawVector(v1, "green");
      drawVector(v2, "green");
      // not in directions but helpful to see
      // console.log("Normalized v1:", v1);
      // console.log("Normalized v2:", v2);

    } else if (pick === "angle") {
      // q7 angle between function
	    let angbet = angleBetween(v1, v2);
	    console.log("Angle:", angbet);

    } else if (pick === "area") {
	    let area = areaTriangle(v1, v2);
	    console.log("Area of triangle:", area);
    }
}

function angleBetween(v1, v2) {
  // do dot prod
  var dotprod = Vector3.dot(v1, v2);
  var v1mag = v1.magnitude();
  var v2mag = v2.magnitude();
  let temp = v1mag * v2mag; // absolute val in mag
  if (temp === 0) {
    return 0;
  }
  // divide dot by mag 1 * mag 2 if not 0
  var cos = dotprod / temp;
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/acos
  // take cos to get angle
  var angleval = Math.acos(cos);
  // https://www.geeksforgeeks.org/javascript-program-to-convert-radians-to-degree/
  var trans = angleval * (180 / Math.PI);

  return trans;
}
// q8
function areaTriangle(v1, v2) {
  var crossprod = Vector3.cross(v1, v2);
  var absarea = crossprod.magnitude(); // this is area of parrallelogram
  var half = 1 / 2
  var area = half * absarea; // half it to get triangle
  return area;
}

function handleDrawEvent() {
 // clear and fill back black
 var canvas = document.getElementById("example");
 var ctx = canvas.getContext("2d");
 ctx.clearRect(0, 0, 400, 400);
 ctx.fillStyle = "black";
 ctx.fillRect(0, 0, 400, 400);

 //get vals
 var xc = 0;
 var yc = 0;
 var xc2 = 0;
 var yc2 = 0;
 xc = document.getElementById("x").value;
 yc = document.getElementById("y").value;
 xc2 = document.getElementById("x2").value;
 yc2 = document.getElementById("y2").value;
 xc = parseFloat(xc);
 yc = parseFloat(yc);
 xc2 = parseFloat(xc2);
 yc2 = parseFloat(yc2);

 var v1 = new Vector3([xc, yc, 0]);
 var v2 = new Vector3([xc2, yc2, 0]);
 // draw
 drawVector(v1, "red");
 drawVector(v2, "blue");
}

function drawVector(v, color) {
  // https://www.w3schools.com/jsref/canvas_strokestyle.asp
  // q2, q3, q4, q5
  
  var canvas = document.getElementById("example");
  var ctx = canvas.getContext("2d");
  // is 400x400x0 center = 200,200,0
  var xmid = 200;
  var ymid = 200;
  // set given color
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(xmid, ymid);
  // scale by 20 from q2, from middle to end of v (x,y,z)
  xmid = xmid + v.elements[0] * 20;
  ymid = ymid - v.elements[1] * 20;
  ctx.lineTo(xmid, ymid);
  ctx.stroke();
}
