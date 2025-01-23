// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
//see youtube playlist for many of the edits
var VSHADER_SOURCE =
  'uniform float u_size;\n' + // https://stackoverflow.com/questions/75330691/webgl-applying-animation-to-only-specific-objects-among-others
  'attribute vec4 a_Position;\n' + // some helpful tips above
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

//global see yt
let g_Color = [0.0, 0.0, 0.0, 1.0];
let g_Size = 4;
let g_Segment = 5;
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size; // might need more
//not global 
var p = 0;
var t = 1;
var c = 2;
let g_Type = p;
//from yt video 1.1d (never change)
function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
} 
function addActionsForHtmlUI(){
  // red and green see yt and html book sites
  document.getElementById('green').onclick = function() { g_Color = [0.0, 1.0, 0.0, 1.0]; };
  document.getElementById('red').onclick = function() { g_Color = [1.0, 0.0, 0.0, 1.0]; };

  document.getElementById('redSlide').addEventListener('mouseup', function(){g_Color[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function(){g_Color[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function(){g_Color[2] = this.value/100;});

  document.getElementById('sizeSlide').addEventListener('mouseup', function(){g_Size = this.value;});
  document.getElementById('segmentSlide').addEventListener('mouseup', function(){g_Segment = this.value;});
  opacity_slide = document.getElementById('opacitySlide');
  opacityValue = document.getElementById('opacityval');
  // i tried to do opacity and settled for saturation
  // https://www.w3schools.com/howto/howto_js_rangeslider.asp
  //https://www.geeksforgeeks.org/how-to-create-a-color-generator-using-html-css-and-javascript/
  //https://www.instructables.com/Making-a-HTML-Colors-Mixer/
  //https://stackoverflow.com/questions/2359537/how-to-change-the-opacity-alpha-transparency-of-an-element-in-a-canvas-elemen
  //https://www.w3schools.com/tags/canvas_globalalpha.asp
  opacity_slide.addEventListener('input', function() {opacVal = opacity_slide.value; opacityValue.textContent = opacVal; g_Color[3] = parseFloat(opacVal);});
  
  document.getElementById('Clbutton').onclick = function(){ 
    g_shapes = []; renderAllShapes()};
  document.getElementById('Sbutton').onclick = function() { g_Type = p;};
  document.getElementById('Tbutton').onclick = function() { g_Type = t};
  document.getElementById('Cbutton').onclick = function() { g_Type = c};
  document.getElementById('Ibutton').onclick = function() {Maggie()};

}
// from same vid as above
function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_size = gl.getUniformLocation(gl.program, 'u_size');
  if (!u_size) {
    console.log('Failed to get the storage location of u_size');
    return;
  }

}
var g_shapes = [];
function click(ev){
  //from yt vids
  let [x,y] = convertCoordinatesEventToGL(ev);
  let point;
  if(g_Type == p){
    point = new Point();
  } else if (g_Type == c){
    point = new Circle();
    point.segments = g_Segment;
  }
  else if (g_Type == t){
    point = new Triangle();
  }
  point.position = [x,y];
  point.color = g_Color.slice();
  point.size = g_Size;
  g_shapes.push(point);

  renderAllShapes();
}
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x,y]); // from yt video
}
function renderAllShapes(){
  var startTime = performance.now();
  // see render shapes yt vid
  gl.clear(gl.COLOR_BUFFER_BIT);
  //g_shapes combines points and colors (xy and rgba)
  for(var i = 0; i < g_shapes.length; i++) {
    //render func in point.js
    g_shapes[i].render();
    //use similar for loop for art
  }
  document.getElementById("wowtextmsg").textContent = "Wow! You are so cool and talented!!!!!!!! #swag";
  //https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
  setTimeout(() => {wowtextmsg.textContent = "";}, 1500);
}
function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

function Maggie(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapes = [];
  var g_colors = [];
  //top head
  g_shapes.push([-0.3, 0.5, 0.3, 0.45, 0.3, 0.5]); 
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  g_shapes.push([-0.3, 0.5, -0.3, 0.45, 0.3, 0.5]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  //bottom head
  g_shapes.push([0.16, -0.07, -0.16, -0.07, -0.14, -0.06]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  g_shapes.push([-0.16, -0.07, 0.16, -0.07, 0.14, -0.06]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  //body
  g_shapes.push([0.16, -0.8, -0.3, -0.8, -0.14, -0.06]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  g_shapes.push([-0.16, -0.8, 0.3, -0.8, 0.14, -0.06]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  //left ear
  g_shapes.push([-0.3, 0.3, -0.4, 0.6, -0.1, 0.5]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  g_shapes.push([-0.25, 0.25, -0.35, 0.55, -0.08, 0.45]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  //left face side
  g_shapes.push([-0.3, 0.3, -0.16, -0.07, -0.14, -0.06]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  //right face side
  g_shapes.push([0.3, 0.3, 0.16, -0.07, 0.14, -0.06]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  //right ear
  g_shapes.push([0.3, 0.3, 0.4, 0.6, 0.1, 0.5]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  g_shapes.push([0.25, 0.25, 0.35, 0.55, 0.08, 0.45]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  //left eye
  g_shapes.push([-0.1, 0.26, -0.15, 0.3, -0.05, 0.3]);
  g_colors.push([0.53, 0.81, 0.92, 1.0]);
  //right eye
  g_shapes.push([0.1, 0.26, 0.15, 0.3, 0.05, 0.3]);
  g_colors.push([0.53, 0.81, 0.92, 1.0]);
 //nose
  g_shapes.push([0.0, 0.05, 0.05, 0.1, -0.05, 0.1]);
  g_colors.push([1.0, 0.08, 0.58, 1.0]);
  //whisker right
  g_shapes.push([0.5, 0.02, 0.05, 0.1, 0.16, 0.1]);
  g_colors.push([1.0, 1.0, 1.0, 1.0]);
  g_shapes.push([0.5, -0.05, 0.05, 0.1, 0.09, 0.1]);
  g_colors.push([1.0, 1.0, 1.0, 1.0]);
  g_shapes.push([0.5, 0.1, 0.05, 0.1, 0.17, 0.09]);
  g_colors.push([1.0, 1.0, 1.0, 1.0]);
  //whisker left
  g_shapes.push([-0.5, 0.02, -0.05, 0.1, -0.16, 0.1]);
  g_colors.push([1.0, 1.0, 1.0, 1.0]);
  g_shapes.push([-0.5, -0.05, -0.05, 0.1, -0.09, 0.1]);
  g_colors.push([1.0, 1.0, 1.0, 1.0]);
  g_shapes.push([-0.5, 0.1, -0.05, 0.1, -0.17, 0.09]);
  g_colors.push([1.0, 1.0, 1.0, 1.0]);
  //tail
  g_shapes.push([0.26, -0.8, 0.35, -0.8, 0.4, -0.17]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  g_shapes.push([0.35, -0.4, 0.37, -0.01, 0.4, -0.2]);
  g_colors.push([1.0, 0.55, 0.0, 1.0]);
  //arms
  g_shapes.push([0.08, -0.8, 0.16, -0.8, 0.14, -0.3]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([-0.08, -0.8, -0.16, -0.8, -0.14, -0.3]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  //paws
  g_shapes.push([0.08, -0.8, 0.16, -0.8, 0.11, -0.85]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([-0.08, -0.8, -0.16, -0.8, -0.11, -0.85]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([0.15, -0.8, 0.24, -0.8, 0.19, -0.89]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([-0.15, -0.8, -0.24, -0.8, -0.19, -0.89]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  //legs
  g_shapes.push([-0.32, -0.82, -0.20, -0.82, -0.28, -0.57]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([0.32, -0.82, 0.20, -0.82, 0.28, -0.57]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([-0.33, -0.82, -0.15, -0.82, -0.25, -0.75]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);
  g_shapes.push([0.33, -0.82, 0.15, -0.82, 0.25, -0.75]);
  g_colors.push([0.55, 0.27, 0.07, 1.0]);

  for (var i = 0; i < g_shapes.length; i++) {
    drawTriangle(g_shapes[i], g_colors[i]);
  }
  g_shapes = [];
}


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){ if(ev.buttons == 1){click(ev)}};

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

