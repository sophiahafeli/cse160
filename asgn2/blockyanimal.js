// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =
//The vertex shader should have a line similar to glPosition = u_ModelMatrix * a_position;
//Modify the vertex shader to be glPostion = u_GlobalRotation * uModelMatrix * a_position
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_globalrotation;\n' +
  'void main() {\n' +
  '  gl_Position = u_globalrotation * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


//leave its in yt just stop messing around please
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize=5;
let g_selectedType=POINT;
// Also attach this to a uniform variable that gets passed to GLSL.
let g_animalglobalrotation=0;
//Probably store the slider angles in global variables, like all UI elements. Edit the render() function to make use of these angles.
let rarm_angle=0;
let beak_angle=0;
let larm_angle=0;
let lleg_angle=0;
let lleg_angle2=0;
let body_angle=0;
let head_angle=0;
let feet_angle=0;
let joint_angle=0;
let isanimate = false;
var canvas;
let gl;
let a_Position;
let u_FragColor;
let u_size;
let u_ModelMatrix;
let u_globalrotation;
var pose = false;
//https://www.w3schools.com/howto/howto_js_display_checkbox_text.asp
//https://bito.ai/resources/javascript-checkbox-onchange-javascript-explained/
//cited this last var section later for checkbox
var manualview = false; 
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var cameraAngleX = 0;  
var cameraAngleY = 0;  


function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();
  initMouseHandlers();

  // clear canvas color
  gl.clearColor(0.1, 0.2, 0.3, 0.9);
  requestAnimationFrame(tick);
}

// Create a global variable for the time, or frame of your animation.
let globalstart=performance.now()/1000.0;
let g_time = performance.now()/1000.0 - globalstart;
//Whenever there is a tick() event, then you need to {g_time=theNewTime(); renderScene()}
function theNewTime(){
  return g_time = performance.now()/1000.0-globalstart;
}
//Add a tick() function (as discussed in the book). Create a global variable for the time, or frame of your animation.
function tick(){
  //Whenever there is a tick() event, then you need to {g_time=theNewTime(); renderScene()}
  theNewTime();  
  console.log(performance.now());
  updateAnimationAngles();
  renderScene(); //tick and render instead of in main
  requestAnimationFrame(tick);
}


function connectVariablesToGLSL(){
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // get u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  // get u_ModelMatrix
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  // get u_globalrotation
  u_globalrotation = gl.getUniformLocation(gl.program, 'u_globalrotation');
  if (!u_globalrotation) {
    console.log('Failed to get the storage location of u_globalrotation');
    return;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}
function setupWebGL(){
  canvas = document.getElementById('webgl'); 
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
}
//in youtube
function addActionsForHtmlUI(){
 //Add a button(s) to turn animation on and off,
  document.getElementById('startanimate').onclick = function() {isanimate = true};
  document.getElementById('stopanimate').onclick = function() {isanimate = false};
  document.getElementById('leftArm').addEventListener('mousemove', function(){rarm_angle = this.value; renderScene(); });
  document.getElementById('rightArm').addEventListener('mousemove', function(){larm_angle = this.value; renderScene(); });
  document.getElementById('leftleg').addEventListener('mousemove', function(){lleg_angle = this.value; renderScene(); });
  //document.getElementById('rightleg').addEventListener('mousemove', function(){rleg_angle = this.value; renderScene(); });
  document.getElementById('leftleg2').addEventListener('mousemove', function(){lleg_angle2 = this.value; renderScene(); });
  //document.getElementById('rightleg2').addEventListener('mousemove', function(){rleg_angle2 = this.value; renderScene(); });
  document.getElementById('feet').addEventListener('mousemove', function(){feet_angle = this.value; renderScene(); });
  document.getElementById('body').addEventListener('mousemove', function(){body_angle = this.value; renderScene(); });
  document.getElementById('headtilt').addEventListener('mousemove', function(){head_angle = this.value; renderScene(); });
  document.getElementById('beaktilt').addEventListener('mousemove', function(){beak_angle = this.value; renderScene(); });
  //Have a slider that sets a global variable for the rotation angle gAnimalGlobalRotation; Also attach this to a uniform variable that gets passed to GLSL.
  document.getElementById('gAnimalGlobalRotation').addEventListener('mousemove', function(){g_animalglobalrotation = this.value; renderScene(); });
  document.getElementById('joint').addEventListener('mousemove', function(){joint_angle = this.value; renderScene(); });
  //checkbox.addEventListener('manualview', gomanual);
}

//with a performance indicator on your webpage. from youtube vids
function thefsp(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

// from youttube vids

//Add a button(s) to turn animation on and off, and move the animation code to a 
// updateAnimationAngles() function that will automatically set the joint angle of at 
// least one part. If its the same part you used previously, use the animation function 
// instead of the slider values when animation is on.  Try to keep the animation logic out o
// f your render() function.
function updateAnimationAngles(){
  if(isanimate){
    lleg_angle = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
    //rleg_angle = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
    lleg_angle2 = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
    joint_angle = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
    rarm_angle = 50 * Math.sin(performance.now()/1000.0-globalstart) + 20; 
    larm_angle = 50 * Math.sin(performance.now()/1000.0-globalstart) + 20; 
    body_angle = 5 * Math.sin(performance.now()/1000.0-globalstart) + 10; 
    head_angle = 10 * Math.sin(performance.now()/1000.0-globalstart) + 5;
    beak_angle = 10 * Math.sin(performance.now()/1000.0-globalstart) + 5;
    feet_angle = 10 * Math.sin(performance.now()/1000.0-globalstart) - 5; 
    
  }
}
//mouseEvent.shiftKey
function initMouseHandlers() {
  canvas.onmousedown = function(event) {
    if (event.shiftKey) {
      if (pose==true){
        pose = false;
        renderScene();
        return;
      } else{
        pose = true; 
        renderScene();
        return;
      }
    }
    if (manualview==true) {
      mouseDown = true;
      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
    } else {
      return;
    }
  };
  
   // this was a recommended autofill to me before i could turn off the copilot thing that i did not know existed https://github.com/nervaljunior/computergraphicsblob/62813398743dfdbe1f80b642149bf23b540080cb/triangle.js
  canvas.onmousemove = function(event) {
    if (mouseDown){
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

    cameraAngleX += deltaX / 5; 
    cameraAngleY -= deltaY / 5; 

    lastMouseX = newX;
    lastMouseY = newY;

    renderScene();
    } else {
      return;
    }
};
}
// Call the renderScene() function at the end of main(), and also after you update a slider
function renderScene(){
  // {glClear(); M=scale(2,1,2); drawCube(M); M=identity(); M.translate(1,2,3);M.rotate(30);drawCube(M)}
  // from yt vids
  var startTime = performance.now();

  var globalRotMat = new Matrix4();

  if (manualview) {

    globalRotMat.rotate(cameraAngleY, 1, 0, 0)  
                .rotate(cameraAngleX, 0, 1, 0); 
  } else {
   
    globalRotMat.rotate(g_animalglobalrotation, 0, 1, 0);
  }
  gl.uniformMatrix4fv(u_globalrotation, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //body
  var body = new Cube();
  //transformations
  if(pose){
  body.color = [0.4, 0.85, 0.4, .99];
  body.matrix.translate(-0.14, -.2, 0.0);
  body.matrix.rotate(body_angle/2, -1, 0, 0);
  body.matrix.scale(.2, .4, .1);
  } else{
  body.color = [0.7, 0.6, 0.92, 1];
  body.matrix.translate(-0.14, -.2, 0.0);
  body.matrix.rotate(body_angle, 1, 0, 0);
  body.matrix.scale(.2, .4, .1);
  }
  
  body.render();
  
   //pedestial cube
  var ped = new Cube();
  ped.color = [0.9, 0.85, 0.4, 0.7];
  //transformations
  ped.matrix.translate(-0.44, -.9, -0.12);
  ped.matrix.rotate(180, 1, 0, 1);
  ped.matrix.scale(.6, .5, 0.8);
  ped.render();
  //pedestial cube 2
  var ped2 = new Cube();
  ped2.color = [0.85, 0.85, 0.85, 0.9];
  //transformations
  ped2.matrix.translate(-0.84, -.95, -0.12);
  ped2.matrix.rotate(180, 1, 0, 1);
  ped2.matrix.scale(.6, .5, 0.4);
  ped2.render();
  //pedestial cube 3
  var ped3 = new Cube();
  ped3.color = [0.7, 0.5, 0.4, 0.7];
  //transformations
  ped3.matrix.translate(0.35, -.95, -0.12);
  ped3.matrix.rotate(180, 1, 0, 1);
  ped3.matrix.scale(.6, .5, 0.4);
  ped3.render();

  /* round body
   var bodyr = new Circle();
   var bodyra = new Matrix4(body.matrix);
   bodyr.matrix = bodyra;
   //change the color
   bodyr.color = [0.74, 0.54, 0.92, 1];
   //change the location of the cube
   bodyr.matrix.translate(0.5, .5, 0.4);
   //rotate the cube, Angle, x, y, z directions
   bodyr.matrix.rotate(0, 0, 0, 1);
   // changes the shape of the cube
   bodyr.matrix.scale(.55, .45, 0.8);
   bodyr.render();*/
   //neck 
  var neck = new Cube();
  neck.matrix = new Matrix4(body.matrix);
  if(pose){
    neck.color = [0.4, 0.85, 0.4, .99];
    neck.matrix.translate(0.4, 1, 0.4);
    neck.matrix.rotate(head_angle*2, 0, -1, 0);
    neck.matrix.scale(0.2, 0.15, 0.2);
    var necknew = new Cube();
    necknew.matrix = new Matrix4(body.matrix);
    necknew.color = [0.4, 0.85, 0.4, .99];
    necknew.matrix.translate(-0.18, 0.9, 0.2);
    necknew.matrix.rotate(head_angle, -1, 0, 0);
    necknew.matrix.scale(1.4, .2, .8);
    var necknew2 = new Cube();
    necknew2.matrix = new Matrix4(body.matrix);
    necknew2.color = [0.4, 0.85, 0.4, .99];
    necknew2.matrix.translate(0.01, 1, 0.2);
    necknew2.matrix.rotate(head_angle, -1, 0, 0);
    necknew2.matrix.scale(1, .2, .8);
    necknew2.render();
    necknew.render();
    } else{
      neck.color = [0.76, 0.65, 0.99, .95];
      neck.matrix.translate(0.4, 1, 0.4);
  neck.matrix.rotate(head_angle, -1, 0, 0);
  neck.matrix.scale(0.2, 0.15, 0.2);
    }

  neck.render();
   //top undergarm or duolingo face
   
   if(pose){
    var topr = new Circle();
    topr.matrix = new Matrix4(neck.matrix);
    topr.color = [0.8, 0.5, 0.2, .99];
    topr.matrix.translate(0.3, 1.9, -0.9);
    topr.matrix.scale(1, 0.4, 3);

    var beak = new Circle();
    beak.matrix = new Matrix4(neck.matrix);
    beak.color = [0.7, 0.4, 0.1, .99];
    beak.matrix.translate(0.3, 1.6, -0.3);
    beak.matrix.rotate(beak_angle+5, -1, 0, 0);
    beak.matrix.scale(.9, 0.3, 3);
    
    beak.render();

    var eye1 = new Circle();
    eye1.matrix = new Matrix4(neck.matrix);
    eye1.color = [0.8, 0.5, 0.2, .1];
    eye1.matrix.translate(-0.7, 3, -0.9);
    eye1.matrix.scale(1, 0.5, 2);
    var eye2 = new Circle();
    eye2.matrix = new Matrix4(neck.matrix);
    eye2.color = [0.8, 0.5, 0.2, .1];
    eye2.matrix.translate(1.7, 3, -0.9);
    eye2.matrix.scale(1, 0.5, 2);
    eye2.render();
    eye1.render();

    var beye1 = new Circle();
    beye1.matrix = new Matrix4(neck.matrix);
    beye1.color = [0, 0, 0, 1];
    beye1.matrix.translate(-0.7, 3, -1.9);
    beye1.matrix.scale(.5, 0.3, 2);
    var beye2 = new Circle();
    beye2.matrix = new Matrix4(neck.matrix);
    beye2.color = [0, 0, 0, 1];
    beye2.matrix.translate(1.7, 3, -1.9);
    beye2.matrix.scale(.5, 0.3, 2);
    beye2.render();
    beye1.render();

    } else{
      var topr = new Cube();
      topr.matrix = new Matrix4(body.matrix);
      topr.color = [0.11, 0.16, 0.16, 1]
      topr.matrix.translate(-0.07, .65, -0.3);
      topr.matrix.rotate(0, 0, 0, 1);
      topr.matrix.scale(1.1, .2, 1.44);
    }
   topr.render();

    //shoulders
   var sopr = new Cube();
   var sopra = new Matrix4(body.matrix);
   sopr.matrix = sopra;
   if(pose){
    sopr.color = [0.4, 0.85, 0.4, .99];
    var sopr3 = new Cube();
   var sopra3 = new Matrix4(sopr.matrix);
   sopr3.matrix = sopra3;
   sopr3.color = [0.3, 0.75, 0.5, .99];
   sopr3.matrix.translate(-0.35, -0.15, 0.1);
   //sopr3.matrix.rotate(body_angle, 1, 0, 1);
   sopr3.matrix.scale(1.7, 1, 1.7);
   sopr3.render();
    } else{
    sopr.color = [0.7, 0.6, 0.92, 1];
    }
   sopr.matrix.translate(-0.4, .85, 0.01);
   sopr.matrix.rotate(body_angle/10, 1, 1, 0);
   sopr.matrix.scale(1.8, .1, 1);
   sopr.render();

   

   /*var sopr4 = new Cube();
   var sopra4 = new Matrix4(sopr.matrix);
   sopr4.matrix = sopra4;
   sopr4.color = [0.76, 0.65, 0.99, .95];
   sopr4.matrix.translate(0.8, -0.18, 0.1);
   sopr4.matrix.rotate(body_angle, 1, 1, 1);
   sopr4.matrix.scale(0.2, 2.4, 1);
   sopr4.render();*/
    
    //bottom undergarm
    var botr = new Cube();
    var botra = new Matrix4(body.matrix);
    botr.matrix = botra;
    if(pose){
      botr.color = [0.4, 0.85, 0.4, .99];
      } else{
        botr.color = [0.11, 0.16, 0.16, 1]
      }
    botr.matrix.translate(-0.08, -0.01, -0.3);
    botr.matrix.rotate(0, 0, 0, 1);
    botr.matrix.scale(1.2, .35, 1.44);
    botr.render();
    //bottom undergarm hip 1
    var botr1 = new Cube();
    var botra1 = new Matrix4(botr.matrix);
    botr1.matrix = botra1;
    if(pose){
      botr1.color = [0.4, 0.85, 0.4, .99];
      } else{
        botr1.color = [0.11, 0.16, 0.16, 1]
      }
    botr1.matrix.translate(-0.1, -0.28, -0.01);
    botr1.matrix.rotate(4, 0, 0, 1);
    botr1.matrix.rotate(lleg_angle/2, 0, 0, -1);
    botr1.matrix.scale(0.5, 1, 1.2);
    botr1.render();
    //bottom undergarm hip 2
    var botr2 = new Cube();
    var botra2 = new Matrix4(botr.matrix);
    botr2.matrix = botra2;
    if(pose){
      botr2.color = [0.4, 0.85, 0.4, .99];
      } else{
        botr2.color = [0.11, 0.16, 0.16, 1]
      }
    botr2.matrix.translate(0.55, -0.28, -0.1);
    botr2.matrix.rotate(-4, 0, 0, 1);
    botr2.matrix.rotate(joint_angle, 0, 0, 1);
    botr2.matrix.rotate(joint_angle/4,-1,1,0);
    botr2.matrix.scale(0.5, 1, 1.2);
    botr2.render();


   //top undergarm strap left
   var toprs = new Cube();
   var topras = new Matrix4(body.matrix);
   toprs.matrix = topras;
   if(pose){
    toprs.color = [0.4, 0.85, 0.4, .99];
    } else{
      toprs.color = [0.11, 0.16, 0.16, 1]
    }
   toprs.matrix.translate(0.1, .8, -0.07);
   toprs.matrix.rotate(20, 0, 0, 1);
   toprs.matrix.scale(0.1, .2, 1.2);
   toprs.render();

   //top undergarm strap right
   var toprs2 = new Cube();
   var topras2 = new Matrix4(body.matrix);
   toprs2.matrix = topras2;
   if(pose){
    toprs2.color = [0.4, 0.85, 0.4, .99];
    } else{
      toprs2.color = [0.11, 0.16, 0.16, 1]
    }
   toprs2.matrix.translate(0.75, .8, -0.07);
   toprs2.matrix.rotate(-20, 0, 0, 1);
   toprs2.matrix.scale(0.1, .24, 1.2);
   toprs2.render();

  

  //draw head
  var head = new Cube();
  head.matrix = new Matrix4(neck.matrix);
  if(pose){
    head.color = [0.4, 0.85, 0.4, .99];
    } else{
  head.color = [0.76, 0.65, 0.99, .95];
    }
  head.matrix.translate(-1.5, 1.2, -1.8);
  //head.matrix.rotate(head_angle/2, -1, 1, 0);
  head.matrix.scale(4, 3, 6);
  head.render();

 

  //round face
  var facer = new Circle();
  var facera = new Matrix4(neck.matrix);
  facer.matrix = facera;
  if(pose){
    facer.color = [0.4, 0.85, 0.4, .99];
    facer.matrix.translate(0.45, 2.7, 1.1);
  //facer.matrix.rotate(head_angle, -1, 0, 1);
  facer.matrix.scale(2.9, 2, 4);
    } else{
  facer.color = [0.76, 0.65, 0.99, .95];
  facer.matrix.translate(0.45, 2.7, 1.1);
  //facer.matrix.rotate(head_angle, -1, 0, 1);
  facer.matrix.scale(2.3, 2, 3.6);
    }
  
  facer.render();
  
  //right arm
  var armr = new Cube();
  armr.matrix = new Matrix4(sopra.matrix);
  if(pose){
    armr.color = [0.3, 0.75, 0.5, .99];
    armr.matrix.setTranslate(.07, 0.12, 0.12);
  armr.matrix.rotate(55, 0, 0, 1);
  armr.matrix.rotate(-rarm_angle/1.5+30, -1, 0, -1);
  //armr.matrix.rotate(body_angle, 1, 0, 0);
  armr.matrix.scale(.05, -0.65, -.05);
    } else{
  armr.color = [0.76, 0.65, 0.99, .95];
  armr.matrix.setTranslate(.07, 0.16, 0.12);
  armr.matrix.rotate(7, 0, 0, 1);
  armr.matrix.rotate(-rarm_angle/2-5, 1, 0, 1);
  //armr.matrix.rotate(body_angle, 1, 0, 0);
  armr.matrix.scale(.05, -0.4, -.05);
    }
  
  armr.render();

    //draw right hand
    var armr2 = new Cube();
    armr2.matrix = new Matrix4(armr.matrix);
    if(pose){
      armr2.color = [0.4, 0.85, 0.4, .99];
      } else{
    armr2.color = [0.76, 0.65, 0.99, .95];
      }
    armr2.matrix.translate(0, 1, 0);
    armr2.matrix.rotate(13,1,0,0);
    armr2.matrix.scale(0.8, .3, 0.8);
    armr2.render();

  //draw left arm
  var arml = new Cube();
  arml.matrix = new Matrix4(sopra.matrix);
  if(pose){
    arml.color = [0.3, 0.75, 0.5, .99];
    arml.matrix.setTranslate(-.2, 0.16, 0.12);
    arml.matrix.rotate(-55, 0, 0, 1);
    arml.matrix.rotate(larm_angle/2+25, 1, -1, 1);
  //arml.matrix.rotate(body_angle, 1, 1, 0);
  arml.matrix.scale(.05, -0.65, -.05);
    } else{
  arml.color = [0.76, 0.65, 0.99, .95];
  arml.matrix.setTranslate(-.2, 0.16, 0.12);
  arml.matrix.rotate(-7, 0, 0, 1);
  arml.matrix.rotate(larm_angle/1.2+30, -1, 1, 0);
  //arml.matrix.rotate(body_angle, 1, 1, 0);
  arml.matrix.scale(.05, -0.4, -.05);
    }
  
  arml.render();

  //left hand
  var arml2 = new Cube();
  var Leftarma2 = new Matrix4(arml.matrix);
  arml2.matrix = Leftarma2;
  
  if(pose){
    arml2.color = [0.4, 0.85, 0.4, .99];
    } else{
  arml2.color = [0.76, 0.65, 0.99, .95];
    }
   
    arml2.matrix.translate(0, 1, 0);
   
    arml2.matrix.rotate(13,1,0,0);
   
    arml2.matrix.scale(0.8, .3, 0.8);
  arml2.render();
  

  //top right leg
  var legr = new Cube();
  legr.matrix = new Matrix4(botr1.matrix);
  if(pose){
    legr.color = [0.4, 0.85, 0.4, .99];
    legr.matrix.setTranslate(-0.15, -0.19, 0.08);
    legr.matrix.rotate(180, 1, 0, 0);
    //legr.matrix.rotate(lleg_angle*2,0,0,1);
    legr.matrix.rotate(lleg_angle,1,0,-1);
    legr.matrix.scale(.07, 0.35, 0.1);
    } else{
  legr.color = [0.76, 0.65, 0.99, .95];
  legr.matrix.setTranslate(-0.15, -0.19, 0.08);
    legr.matrix.rotate(180, 1, 0, 0);
    legr.matrix.rotate(lleg_angle,0,0,1);
    legr.matrix.rotate(lleg_angle/2,1,0,0);
    legr.matrix.scale(.07, 0.35, 0.1);
    }
    
    legr.render();

  //bot right leg
  var legr2 = new Cube();
  legr2.matrix = new Matrix4(legr.matrix);
  if(pose){
    legr2.color = [0.8, 0.5, 0.2, .99];
    legr2.matrix.translate(0.2, 0.7, .65);
  legr2.matrix.rotate(90, 0, 1, 0);
  legr2.matrix.rotate(-lleg_angle2*2,-1,0,0);
  //legr2.matrix.rotate(lleg_angle2*2,0,0,-1);
  legr2.matrix.scale(.5, 1.2, 0.5);
    } else{
  legr2.color = [0.76, 0.65, 0.99, .95];
  legr2.matrix.translate(0.2, 0.7, .65);
  legr2.matrix.rotate(90, 0, 1, 0);
  legr2.matrix.rotate(lleg_angle2,0,0,-1);
  legr2.matrix.rotate(lleg_angle2-14,-1,0,0);
  legr2.matrix.scale(.5, 1.2, 0.5);
    }
  
  legr2.render();



  //top right leg
  var legl1 = new Cube();
  legl1.matrix = new Matrix4(botr2.matrix);
  if(pose){
    legl1.color = [0.4, 0.85, 0.4, .99];
    legl1.matrix.setTranslate(0, -0.19, 0.1);
    legl1.matrix.rotate(180, 1, 0, 0);
    legl1.matrix.rotate(joint_angle,0,0,1);
    legl1.matrix.rotate(joint_angle/2,-1,0,0);
    legl1.matrix.scale(.07, 0.35, 0.1);
    } else{
  legl1.color = [0.76, 0.65, 0.99, .95];
  legl1.matrix.setTranslate(0, -0.19, 0.1);
    legl1.matrix.rotate(180, 1, 0, 0);
    legl1.matrix.rotate(joint_angle,0,0,-1);
    legl1.matrix.rotate(joint_angle/2,1,0,0);
    legl1.matrix.scale(.07, 0.35, 0.1);
    }
    
    legl1.render();

  //bot right leg
  var legl2 = new Cube();
  legl2.matrix = new Matrix4(legl1.matrix);
  if(pose){
    legl2.color = [0.8, 0.5, 0.2, .99];
    legl2.matrix.translate(0.2, 0.7, .2);
  legl2.matrix.rotate(0, 0, 1, 0);
  legl2.matrix.rotate(joint_angle*2,-1,0,0); 
  legl2.matrix.rotate(joint_angle*2,0,0,-1);
  legl2.matrix.scale(.5, 1.2, 0.5);
    } else{
  legl2.color = [0.76, 0.65, 0.99, .95];
  legl2.matrix.translate(0.2, 0.7, .2);
  legl2.matrix.rotate(0, 0, 1, 0);
  legl2.matrix.rotate(joint_angle,-1,0,0); 
  legl2.matrix.rotate(joint_angle-14,0,0,-1);
  legl2.matrix.scale(.5, 1.2, 0.5);
    }
  legl2.render();

  var feet = new Circle();
  feet.matrix = new Matrix4(legl2.matrix);
  if(pose){
    return;
    } else{
  feet.color = [0.76, 0.65, 0.99, .95];
  feet.matrix.translate(0.6, 0.9, .45);
  feet.matrix.rotate(-7, 0, 0, 1);
  feet.matrix.rotate(-7, 1, 0, 0);
  feet.matrix.rotate(joint_angle/2,1,1,1); 
  feet.matrix.scale(0.9, 0.14, 0.9);
    }
  feet.render();
  var feet2 = new Circle();
  feet2.matrix = new Matrix4(legr2.matrix);
  if(pose){
    return;
    } else{
  feet2.color = [0.76, 0.65, 0.99, .95];
  feet2.matrix.translate(0.6, 1, .6);
  feet2.matrix.rotate(180, 0, 1, 0);
  feet2.matrix.rotate(99, 1, 0, 0);
  feet2.matrix.rotate(2, 0, 0, 1);
  feet2.matrix.rotate(feet_angle/1.2,0,1,1); 
  feet2.matrix.scale(1.2, 1, 0.19);
  feet2.render();
    }
  

//from youtube vids
    var duration = performance.now() - startTime;
    var fps = 1000/duration 
    thefsp("fps: "+Math.floor(fps),"thefsp");
  }
