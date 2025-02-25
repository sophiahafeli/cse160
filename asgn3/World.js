var VSHADER_SOURCE = `
    precision mediump float;
	attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
	uniform mat4 u_ModelMatrix;
	uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
  }`
var FSHADER_SOURCE = `
	precision mediump float;
    varying vec2 v_UV;
	uniform vec4 u_FragColor; 
	uniform sampler2D u_Sampler0;
	uniform sampler2D u_Sampler1;
	uniform sampler2D u_Sampler2;
	uniform sampler2D u_Sampler3;
	uniform sampler2D u_Sampler4;
	uniform sampler2D u_Sampler5;
	uniform sampler2D u_Sampler6;
	uniform sampler2D u_Sampler7;
	uniform sampler2D u_Sampler8;
	uniform sampler2D u_Sampler9;
	uniform int u_whichTexture;
	void main() {
		// Use Color
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;
    }
    // Use UV Debug Color
    else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0);
    }
    // Use Textures
    else if (u_whichTexture == 0) {                   // Netherrack
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
	else if (u_whichTexture == 1){                    // Lava
		gl_FragColor = texture2D(u_Sampler1, v_UV);   
	  }
	else if (u_whichTexture == 2){                    // wood1
		gl_FragColor = texture2D(u_Sampler2, v_UV);
	}
	else if (u_whichTexture == 3){                    // Brick
		gl_FragColor = texture2D(u_Sampler3, v_UV);
	}
	else if (u_whichTexture == 4){                    // door
		gl_FragColor = texture2D(u_Sampler4, v_UV);
	}
	else if (u_whichTexture == 5){                    // Leaves
		gl_FragColor = texture2D(u_Sampler5, v_UV);
	}
	else if (u_whichTexture == 6){                    // wood
		gl_FragColor = texture2D(u_Sampler6, v_UV);
	}
	else if (u_whichTexture == 7){                    // Plank
		gl_FragColor = texture2D(u_Sampler7, v_UV);
	}
	else if (u_whichTexture == 8){                    // diamond
		gl_FragColor = texture2D(u_Sampler8, v_UV);
	}
	else if (u_whichTexture == 9){                    // Villager
		gl_FragColor = texture2D(u_Sampler9, v_UV);
	}
}`

let canvas;
let gl;

let u_Sampler0;
let u_Sampler1
let u_Sampler2;
let u_Sampler3;
let u_Sampler4;
let u_Sampler5;
let u_Sampler6;
let u_Sampler7;
let u_Sampler8;
let u_Sampler9;
let a_Position;
let a_UV;
let u_FragColor;
let u_whichTexture;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;

function setupWebGl() {
	canvas = document.getElementById('webgl');
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
	if (!gl) {
	  console.log('Failed to get the rendering context for WebGL');
	  return;
	}
	gl.enable(gl.DEPTH_TEST);
}
function initTextures() {
	var image = new Image(); 
	if (!image) {
		console.log('Failed to create the image object');
		return false;
	}
	var imagelava = new Image();
  	if (!imagelava) {
    	console.log('Failed to create the imagelava object');
    	return false;
	}
	var imagewood1 = new Image();
  	if (!imagewood1) {
    	console.log('Failed to create the imagewood1 object');
    	return false;
	}
	var imagebrick = new Image();
  	if (!imagebrick) {
    	console.log('Failed to create the imagebrick object');
    	return false;
	}
	var imagedoor3 = new Image();
  	if (!imagedoor3) {
    	console.log('Failed to create the imagedoor3 object');
    	return false;
	}
	var imageLeaves = new Image();
  	if (!imageLeaves) {
    	console.log('Failed to create the imageLeaves object');
    	return false;
	}
	var imagewood = new Image();
  	if (!imagewood) {
    	console.log('Failed to create the imagewood object');
    	return false;
	}
	var imagePlank = new Image();
  	if (!imagePlank) {
    	console.log('Failed to create the imagePlank object');
    	return false;
	}
	var imageDiamond = new Image();
  	if (!imagePlank) {
    	console.log('Failed to create the imagePlank object');
    	return false;
	}
	var imageVillager = new Image();
  	if (!imageVillager) {
    	console.log('Failed to create the imageVillager object');
    	return false;
	}
	image.onload = function(){ sendImageToTexture0(image); };
  image.src = 'netherrack.jpg';

	imagelava.onload = function() {sendImageToTexture1(imagelava); };
  imagelava.src = 'Lava.jpg';

	imagewood1.onload = function() {sendImageToTexture2(imagewood1); };
  imagewood1.src = 'wood1.jpg'

	imagebrick.onload = function() {sendImageToTexture3(imagebrick); };
  imagebrick.src = 'brick.jpg'

	imagedoor3.onload = function() {sendImageToTexture4(imagedoor3); };
  imagedoor3.src = 'door.jpg'

	imageLeaves.onload = function() {sendImageToTexture5(imageLeaves); };
  imageLeaves.src = 'leaves.jpg'

	imagewood.onload = function() {sendImageToTexture6(imagewood); };
  imagewood.src = 'wood.jpg'

	imagePlank.onload = function() {sendImageToTexture7(imagePlank); };
  imagePlank.src = 'plank.jpg'

  	imageDiamond.onload = function() {sendImageToTexture8(imageDiamond); };
  imageDiamond.src = 'Diamond.jpg'

  imageVillager.onload = function() {sendImageToTexture9(imageVillager); };
  imageVillager.src = 'VillagerFace.jpg'
	
	return true;
}

function connectVariablesToGLSL() {
	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
		console.log('Failed to intialize shaders.');
		return;
	}
	a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	if (a_Position < 0) {
		console.log('Failed to get the storage location of a_Position');
		return;
	}
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }
	u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
	if (!u_GlobalRotateMatrix) {
		console.log('Failed to get the storage location of u_GlobalRotateMatrix');
		return;
	}
	u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
	if (!u_ViewMatrix) {
		console.log('Failed to get the storage location of u_ViewMatrix');
		return;
	}
	u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
	if (!u_ProjectionMatrix) {
		console.log('Failed to get the storage location of u_ProjectionMatrix');
		return;
	}
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) {
		console.log('Failed to get the storage location of u_ModelMatrix');
		return;
	}
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
	if (!u_whichTexture) {
		console.log('Failed to get the storage location of u_whichTexture');
		return false;
	}
	u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
	if (!u_Sampler0) {
		console.log('Failed to get the storage location of u_Sampler0');
		return false;
	}
	u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
	if (!u_Sampler1) {
	  console.log('Failed to get the storage location of u_Sampler1');
	  return false;
	}  
	u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
	if (!u_Sampler2) {
	  console.log('Failed to get the storage location of u_Sampler2');
	  return false;
	}  
	u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
	if (!u_Sampler3) {
	  console.log('Failed to get the storage location of u_Sampler3');
	  return false;
	}  
	u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
	if (!u_Sampler4) {
	  console.log('Failed to get the storage location of u_Sampler4');
	  return false;
	} 
	u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
	if (!u_Sampler5) {
	  console.log('Failed to get the storage location of u_Sampler5');
	  return false;
	}  
	u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
	if (!u_Sampler6) {
	  console.log('Failed to get the storage location of u_Sampler6');
	  return false;
	}
	u_Sampler7 = gl.getUniformLocation(gl.program, 'u_Sampler7');
	if (!u_Sampler7) {
	  console.log('Failed to get the storage location of u_Sampler7');
	  return false;
	}  
	u_Sampler8 = gl.getUniformLocation(gl.program, 'u_Sampler8');
	if (!u_Sampler8) {
	  console.log('Failed to get the storage location of u_Sampler8');
	  return false;
	}  
	u_Sampler9 = gl.getUniformLocation(gl.program, 'u_Sampler9');
	if (!u_Sampler9) {
	  console.log('Failed to get the storage location of u_Sampler9');
	  return false;
	}  

	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);}
	let g_door = false;
	var g_startTime = performance.now()/1000.0;
	var g_seconds = performance.now()/1000.0-g_startTime;
	let g_globalAngle = 0;

function addActionsForHtmlUI() {
	document.getElementById('angleSlide').addEventListener('mousemove',  function() { g_globalAngle = this.value; renderAllShapes(); });
    document.getElementById("playSoundButton").addEventListener("click", function() {
        var hahaha = document.getElementById("Villager");
        if (hahaha.paused) {
            hahaha.loop = true; 
            hahaha.play();       
            this.textContent = "please stop";
        } else {
            hahaha.pause();      
            hahaha.currentTime = 0;
            this.textContent = "They are laughing at you";
        }
    });

}
//netherrack
function sendImageToTexture0(image){
  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  console.log("Loaded Texture", image);
}
//Lava
function sendImageToTexture1(image){
  var texture1 = gl.createTexture();
  if(!texture1){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);
  console.log("Loaded Texture", image);
}
//stone bricks
function sendImageToTexture3( image){
  var texture3 = gl.createTexture();
  if(!texture3){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, texture3);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler3, 3);
  console.log("Loaded Texture", image);
}
//door
function sendImageToTexture4(image){
  var texture4 = gl.createTexture();
  if(!texture4){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE4);
  gl.bindTexture(gl.TEXTURE_2D, texture4);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler4, 4);
  console.log("Loaded Texture", image);
}
//leaves
function sendImageToTexture5(image){
  var texture5 = gl.createTexture();
  if(!texture5){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE5); 
  gl.bindTexture(gl.TEXTURE_2D, texture5);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler5, 5);

  console.log("Loaded Texture", image);
}
// logs
function sendImageToTexture2(image){
	var texture1 = gl.createTexture();
	if(!texture1){
	  console.log('Failed to create the texture object');
	  return false;
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler2, 2);
	console.log("Loaded Texture", image);
  }
//logs
function sendImageToTexture6(image){
  var texture6 = gl.createTexture();
  if(!texture6){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

  gl.activeTexture(gl.TEXTURE6);
  gl.bindTexture(gl.TEXTURE_2D, texture6);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler6, 6);
  console.log("Loaded Texture", image);
}
//planks
function sendImageToTexture7(image){
  var texture7 = gl.createTexture();
  if(!texture7){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE7);
  gl.bindTexture(gl.TEXTURE_2D, texture7);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler7, 7);
  console.log("Loaded Texture", image);
}

//diamond
function sendImageToTexture8(image){
	var texture8 = gl.createTexture();
	if(!texture8){
	  console.log('Failed to create the texture object');
	  return false;
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE8);
	gl.bindTexture(gl.TEXTURE_2D, texture8);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler8, 8);
	console.log("Loaded Texture", image);
  }

//Villager in the sky i can go twice as hiiiigh
function sendImageToTexture9(image){
	var texture9 = gl.createTexture();
	if(!texture9){
	  console.log('Failed to create the texture object');
	  return false;
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE9);
	gl.bindTexture(gl.TEXTURE_2D, texture9);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler9, 9);
	console.log("Loaded Texture", image);
  }

function main() {

	setupWebGl();
	connectVariablesToGLSL();
	addActionsForHtmlUI();
	initTextures();
	gl.clearColor(0.0, 0.0, 0.0, 1.0);


	canvas.onmousedown = click;
  	canvas.onmousemove = function(ev) {if(ev.buttons == 1) {click(ev)}};
	document.onkeydown = keydown;
	requestAnimationFrame(tick);
	
}
var camera = new Camera();
function click(ev){
	if(ev.buttons == 1) {
		g_globalX = -ev.movementX;
		camera.mousePanX(g_globalX);
	  }
	if(ev.buttons == 1) {
		g_globalY = -ev.movementY;
		camera.mousePanY(g_globalY);
	}
	if (ev.shiftKey){
		g_door = true;
	}
}

function tick() {
	g_seconds = performance.now()/500.0-g_startTime;
	renderAllShapes();
	requestAnimationFrame(tick);
}
// i referenced jasmine for logic and tips on setting up the world
var g_map = [                                                                 

	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 5, 5, 2, 2, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 5, 1, 1, 5, 5, 1, 5, 5, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
	[2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 5, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 3, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 3, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[2, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 5, 4, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 3, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 3, 7, 7, 7, 7, 7, 7, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 6, 6, 5, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 6, 6, 5, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 6, 5, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 5, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[2, 1, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 5, 5, 6, 6, 5, 5, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 5, 5, 6, 6, 5, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 5, 5, 6, 6, 5, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[2, 2, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
	[1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 5, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1],
	[1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 6, 5, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
	[1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 5, 5, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

  ];
  
  function drawMap() {
	var body = new Cube();
	for (x = 0; x < 50; x++) {
	  for (y = 0; y < 50; y++) {
		if (g_map[x][y] == 1) {
		  body.textureNum = 0;
		  body.matrix.setTranslate(0,0,0);
		  body.matrix.translate(x-15, -0.8, y -15);
		  body.render();
		} 
		//wall
		else if (g_map[x][y] == 3) {
			body.textureNum = 2;
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -15, 0.25, y -15);
			body.matrix.scale(1,7,1.5)
			body.render();
		}
		//door
		else if (g_map[x][y] == 4) {
			var door1 = new Cube();
			if(g_door){
				body.textureNum = 7;
				body.matrix.setTranslate(0,0,0);
				body.matrix.translate(x-15, -0.8, y -15);
				body.render();
				door1.textureNum = 2;
				door1.matrix.setTranslate(0,0,0);
				door1.matrix.translate(x -15, 3.8, y -15);
				door1.matrix.scale(1,3.5,1.5)
				door1.render();

			}
			else{
				body.textureNum = 7;
				body.matrix.setTranslate(0,0,0);
				body.matrix.translate(x-15, -0.8, y -15);
				body.render();
				door1.textureNum = 4;
				door1.matrix.setTranslate(0,0,0);
				door1.matrix.translate(x-15, 0.3, y -15);
				door1.matrix.scale(1,3,1)
				door1.render();

				var base = new Cube();
				base.textureNum = 2;
				base.matrix.setTranslate(0,0,0);
				base.matrix.translate(x -15, 3.3, y -15);
				base.matrix.scale(1,4,1.5)
				base.render();
			}
		}
		else if (g_map[x][y] == 2) {
		//trunk
			body.textureNum = 2;
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -15, 0.25, y-15);
			body.matrix.scale(1.5,5.5,1.5)
			body.render();
		// leaves
			body.textureNum = 5
			body.color = [0.04, 0.65, 0.07, 1];
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -14, 5, y -16);
			body.matrix.scale(3,3,3)
			body.render();
			body.textureNum = 5
			body.color = [0.04, 0.65, 0.07, 1];
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -14, 5, y -14);
			body.matrix.scale(3,3,3)
			body.render();
			body.textureNum = 5
			body.color = [0.04, 0.65, 0.07, 1];
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -15, 7, y -15);
			body.matrix.scale(3,3,3)
			body.render();
			body.textureNum = 5
			body.color = [0.04, 0.65, 0.07, 1];
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -17, 5, y -16);
			body.matrix.scale(3,3,3)
			body.render();
			body.textureNum = 5
			body.color = [0.04, 0.65, 0.07, 1];
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x -17, 5, y -14);
			body.matrix.scale(3,3,3)
			body.render();
		}  
		// lava
		else if (g_map[x][y] == 6) {
			body.textureNum = 1;
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x-15, -0.8, y -15);
			body.render();
		} 
		//floor
		else if (g_map[x][y] == 7) {
			body.textureNum = 7;
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x-15, -0.7, y -15);
			body.render();
		} 
		// path
		else if (g_map[x][y] == 5) {
			body.textureNum = 3;
			body.matrix.setTranslate(0,0,0);
			body.matrix.translate(x-15, -0.7, y -15);
			body.render();
		} 
	}
  }
}
function keydown(ev) { // wasd xeqcz possible 
	if (ev.keyCode == 87) {   
		camera.walkf() //w
	}
	else if (ev.keyCode == 83) {  //s
		camera.walkb();   
	}
	if(ev.keyCode == 65) {  //a
		camera.walkl();
	  }
	  if(ev.keyCode == 68) {   //d
		camera.walkr();
	  }
	  if(ev.keyCode == 88) {  //x
		camera.walkd(0.5);
	  }
	  if(ev.keyCode == 69) {  //e
		camera.lookr();
	  }
	  if(ev.keyCode == 90) {    // z
		camera.walku(0.5);
	  }
	  if(ev.keyCode == 81) {   //q
		camera.lookl();
	  }
	  if(ev.keyCode == 67) {  //c
		if (g_door == false){
			g_door = true;
		}
		else{
			g_door = false;
		}
	  }
}

function sendTextToHTML(text, HTMLID){
	var HTMLElem = document.getElementById(HTMLID);
	if(!HTMLElem){
	  printL("Failed to get "+HTMLID+" from HTML");
	  return;
	}
	HTMLElem.innerHTML = text;
  }

function renderAllShapes() {
	var startTime = performance.now();

	var ProjMat = new Matrix4();
	ProjMat.setPerspective(50, canvas.width/canvas.height, 0.1, 1000);
	gl.uniformMatrix4fv(u_ProjectionMatrix, false, ProjMat.elements);
	var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  	gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
	var viewMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
  	viewMat.setLookAt(camera.eye.elements[0],camera.eye.elements[1],camera.eye.elements[2], camera.at.elements[0],camera.at.elements[1],camera.at.elements[2], camera.up.elements[0],camera.up.elements[1],camera.up.elements[2] );
  	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	drawMap();
	var ceilingN = new Cube();
	ceilingN.textureNum = 9;
	ceilingN.matrix.translate(0,100,0)
	ceilingN.matrix.scale(100, -0.1, 100);
	ceilingN.matrix.translate(-0.5,0,-0.5);
	ceilingN.render();

	var floor = new Cube();
	floor.textureNum = 1;
	floor.matrix.translate(0,-.75,0)
	floor.matrix.scale(200, -0.1, 200);
	floor.matrix.translate(-0.5,0,-0.5);
	floor.render();

	var sky = new Cube();
	sky.color = [0.87, 0.15, 0.20, 1];
	sky.matrix.scale(200, 200,200);
	sky.matrix.translate(-.5, -0.1,-.5);
	sky.render();

	var roof = new Cube();
	roof.textureNum = 6;
	roof.matrix.translate(-2.8,7.2,4);
	roof.matrix.scale(14,1,14);
	roof.render();

	var roof1 = new Cube();
	roof1.textureNum = 6;
	roof1.matrix.translate(-0.8,8.2,6);
	roof1.matrix.scale(9.4,1,9.4);
	roof1.render();

	var roof2 = new Cube();
	roof2.textureNum = 6;
	roof2.matrix.translate(1.8,9.2,8);
	roof2.matrix.scale(4.6,1,4.6);
	roof2.render();

	var diamond1 = new Cube();
	diamond1.textureNum = 8;
	diamond1.matrix.translate(1.8,10.2,11);
	diamond1.render();
	diamond1.textureNum = 8;
	diamond1.matrix.translate(-1.7,-10,-3.5);
	diamond1.render();
    
	//jacked this from last lab dont mf touch it PLEASE
	var duration = performance.now() - startTime;
	sendTextToHTML("FPS: " + Math.floor(10000 / duration) / 10, "numdot");
}