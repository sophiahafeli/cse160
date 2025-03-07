
var VSHADER_SOURCE = `
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix; 
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`
  var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;
  uniform vec3 u_spotlightPos;
  uniform vec3 u_spotlightDir;
  
  void main() {
  
    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    
    } else if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor;                

    } else if (u_whichTexture == -1) {    
      gl_FragColor = vec4(v_UV, 1.0, 1.0);

    } else if (u_whichTexture == 0) {           
      gl_FragColor = texture2D(u_Sampler0, v_UV);

    } else if (u_whichTexture == 1) {           
      gl_FragColor = texture2D(u_Sampler1, v_UV);

    } else {                                   
      gl_FragColor = vec4(.2,.2,.5,1);
    }

    vec3 lightVector = u_lightPos - vec3(v_VertPos);
    float r = length(lightVector);
    
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    vec3 R = reflect(-L, N);
    vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
    float specular = pow(max(dot(E,R), 0.0), 64.0);
    
    vec3 diffuse = vec3(1.0,1.0,0.9) * vec3(gl_FragColor) * nDotL *0.8;
    vec3 ambient = (vec3(gl_FragColor) + u_lightColor) * 0.4;
    if (u_lightOn) {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
    }
    else {
          vec3 spotlightVector = normalize(u_spotlightPos - vec3(v_VertPos));
          vec3 L = normalize(spotlightVector);
          vec3 N = normalize(v_Normal);
          float nDotL = max(dot(N, L), 0.0);
          vec3 R = reflect(-L, N);
          vec3 E = normalize(u_cameraPos - vec3(v_VertPos));
          float specular = pow(max(dot(E, R), 0.0), 10.0) * 0.5;
          vec3 diffuse = vec3(gl_FragColor) * nDotL * u_lightColor;
          vec3 ambient = vec3(gl_FragColor) * 0.3;
          gl_FragColor = vec4(specular+diffuse+ambient, gl_FragColor.a);
          float spotEffect = dot(spotlightVector, normalize(u_spotlightDir));
          gl_FragColor.rgb += spotEffect * 0.8;
    }
}`
let a_Normal;
let u_lightPos;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_whichTexture;
let u_lightColor;
let u_spotlightPos;
let u_spotlightDir;
let u_lightOn;
let canvas;
let gl;
let u_cameraPos
let u_FragColor;
let a_Position;
let u_Sampler0;
let u_Sampler1;
let a_UV;
let g_cameraAngles = [0, 0, 0];
let g_globalAngle = 0;
let g_globalAngle_v = 0;
let rarm_angle=0;
let beak_angle=0;
let larm_angle=0;
let lleg_angle=0;
let lleg_angle2=0;
let body_angle=0;
let head_angle=0;
let feet_angle=0;
let joint_angle=0;
let g_animation = false;
let g_startTime = performance.now()/1000.0;
let g_seconds = performance.now()/1000.0-g_startTime;
let g_normalOn = false; 
let g_lightPos =  [0,1.2,-2]
let g_lightOn = true;
let g_lightColor = [0,0,0]
let lRot = true;
let g_spotlightPos =  [0,1.4,-2]
let g_spotlightDir = [0,1,0]
var camera = new Camera();

function setupWebGl() {
	canvas = document.getElementById('webgl');
	gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
	if (!gl) {
	  console.log('Failed to get the rendering context for WebGL');
	  return;
	}
	gl.enable(gl.DEPTH_TEST);
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
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return;
    }
	u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
	if (!u_FragColor) {
		console.log('Failed to get the storage location of u_FragColor');
		return;
	}
	u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
	if (!u_lightColor) {
		console.log('Failed to get the storage location of u_lightColor');
		return;
	}
	u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
	if (!u_lightPos) {
		console.log('Failed to get the storage location of u_lightPos');
		return;
	}
	u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
	if (!u_lightOn) {
		console.log('Failed to get the storage location of u_lightOn');
		return;
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

	u_spotlightPos = gl.getUniformLocation(gl.program, 'u_spotlightPos');
    if (!u_spotlightPos) {
        console.log('Failed to get the storage location of u_spotlightPos');
        return;
    }
	u_spotlightDir = gl.getUniformLocation(gl.program, 'u_spotlightDir');
    if (!u_spotlightDir) {
        console.log('Failed to get the storage location of u_spotlightDir');
        return;
    }
	u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
	if (!u_cameraPos) {
		console.log('Failed to get the storage location of u_cameraPos');
		return;
	}
	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
	if (!u_ModelMatrix) {
		console.log('Failed to get the storage location of u_ModelMatrix');
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
	u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
	if (!u_whichTexture) {
		console.log('Failed to get the storage location of u_whichTexture');
		return false;
	}
	var identityM = new Matrix4();
	gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);}

	// reused from last lab and referenced alex for 
function initTextures() {
	var image = new Image();
	if (!image) {
		console.log('Failed to create the image object');
		return false;
	}
	var imgbrick = new Image();
  	if (!imgbrick) {
    	console.log('Failed to create the imgbrick object');
    	return false;
	}
	image.onload = function(){ sendImageToTEXTURE0(image); };
	imgbrick.onload = function() {sendImageToTEXTURE1(imgbrick); };
	image.src = 'lava.jpg';
	imgbrick.src = 'brick.jpg';
	return true;
}

function addActionsForHtmlUI() {
	document.getElementById('ROn').onclick = function() {lRot = true;};
	document.getElementById('ROff').onclick = function() {lRot = false;};
	document.getElementById('lOn').onclick = function() {g_lightOn = true; };
	document.getElementById('lOff').onclick = function() {g_lightOn = false; };
	document.getElementById('aOn').onclick = function() {g_animation = true; };
	document.getElementById('aOff').onclick = function() {g_animation = false; };
	document.getElementById('nOn').onclick = function() {g_normalOn = true; };
	document.getElementById('nOff').onclick = function() {g_normalOn = false; };
	document.getElementById('angSlide').addEventListener('mousemove',  function() { g_globalAngle = this.value; renderAllShapes(); });
	document.getElementById('lRed').addEventListener('mousemove', function() {g_lightColor[0] = this.value / 100;}); 
  	document.getElementById('lGreen').addEventListener('mousemove', function() {g_lightColor[1] = this.value / 100;});
  	document.getElementById('lBlue').addEventListener('mousemove', function() {g_lightColor[2] = this.value / 100;});
	document.getElementById('lSlideX').addEventListener('mousemove',  function(ev) {if (ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes(); }});
	document.getElementById('lSlideY').addEventListener('mousemove',  function(ev) {if (ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes(); }});
	document.getElementById('lSlideZ').addEventListener('mousemove',  function(ev) {if (ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes(); }});
  

}
function sendImageToTEXTURE0(image) {
	var texture0 = gl.createTexture(); 
	if (!texture0) {
		console.log('Failed to create the texture object');
		return false;
	}
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture0);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler0, 0);
	console.log('finished loadTexture')
} 

function sendImageToTEXTURE1(image) {
	var texture1 = gl.createTexture();
	if (!texture1) {
		console.log('Failed to create the texture object');
		return false;
	}

	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, texture1);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
	gl.uniform1i(u_Sampler1, 1);
	console.log('finished loadTexture')
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
		g_globalY = -ev.movementY;
		camera.mousePanY(g_globalY);
	}
	if (ev.shiftKey){
		g_door = true;
	}
}

function tick() {
	g_seconds = performance.now()/400.0-g_startTime;
	updateAnimationAngles();
	renderAllShapes();
	requestAnimationFrame(tick);
}
let globalstart=performance.now()/1000.0;
let g_time = performance.now()/1000.0 - globalstart;
function theNewTime(){
  return g_time = performance.now()/1000.0-globalstart;
}
function updateAnimationAngles(){

	if(g_animation){
		lleg_angle = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
		lleg_angle2 = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
		joint_angle = 9 * Math.sin(performance.now()/1000.0-globalstart) + 15; 
		rarm_angle = 50 * Math.sin(performance.now()/1000.0-globalstart) + 20; 
		larm_angle = 50 * Math.sin(performance.now()/1000.0-globalstart) + 20; 
		body_angle = 5 * Math.sin(performance.now()/1000.0-globalstart) + 10; 
		head_angle = 10 * Math.sin(performance.now()/1000.0-globalstart) + 5;
		beak_angle = 10 * Math.sin(performance.now()/1000.0-globalstart) + 5;
	}
	if (lRot) {
		g_lightPos[0] = 2 * Math.cos(0.5 * g_seconds);
		g_lightPos[2] = 2 * Math.sin(0.5 * g_seconds);
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
}

function renderAllShapes() {
	
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
	gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);
	gl.uniform1i(u_lightOn, g_lightOn);
	gl.uniform3f(u_spotlightDir, g_spotlightDir[0], g_spotlightDir[1], g_spotlightDir[2]);
	gl.uniform3f(u_spotlightPos, g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
	gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);


	var light = new Cube();
	light.color = [2,2,0,1];
	light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
	light.matrix.translate(0.5, 0.5, 0.5);
	light.matrix.scale(-.1,-.1,-.1);
	light.render();

	var spotlight = new Cube();
	spotlight.color = [2,2,0,1];
	spotlight.matrix.translate(g_spotlightPos[0], g_spotlightPos[1], g_spotlightPos[2]);
	spotlight.matrix.translate(-0.5, -1.9, -1.2);
	spotlight.matrix.scale(1,-.1,-.03);
	spotlight.render();

	var miniworld = new Cube();
	miniworld.color = [0.9, 0.9, 0.9, 1];
	miniworld.textureNum = -2;
	miniworld.matrix.scale(-7, -5, -10);
	miniworld.matrix.translate(-0.5, -0.8, -0.5);
	if (g_normalOn) miniworld.textureNum = -3
	miniworld.render();

	var playcube = new Cube();
	playcube.color = [0, 0.3, 0.8, 1];
	playcube.textureNum = 1;
	playcube.matrix.scale(0.5, 0.5, 0.5);
	playcube.matrix.translate(-3, -0.85, -0.5);
	if (g_normalOn) playcube.textureNum = -3
	playcube.render();

	var sphere = new Sphere(10[1,0,0,0]);
	sphere.textureNum = 0;
	sphere.matrix.translate(1.5,0.5,1);
	sphere.matrix.scale(0.5, 0.5, 0.5)
	if (g_normalOn) sphere.textureNum = -3
	sphere.render();



	/// all done with below

	 //body
	 var body = new Cube();
	 //transformations
   
	 body.color = [0.4, 0.85, 0.4, .99];
	 body.matrix.translate(-0.14, -.2, 0.0);
	 body.matrix.rotate(body_angle/2, -1, 0, 0);
	 body.matrix.scale(.2, .4, .1);
	 
	 
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
   
	  //neck 
	 var neck = new Cube();
	 neck.matrix = new Matrix4(body.matrix);
   
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
	 
   
	 neck.render();
	  //top undergarm or duolingo face
	  
	 
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
   
	  topr.render();
   
	   //shoulders
	  var sopr = new Cube();
	  var sopra = new Matrix4(body.matrix);
	  sopr.matrix = sopra;
   
	   sopr.color = [0.4, 0.85, 0.4, .99];
	   var sopr3 = new Cube();
	  var sopra3 = new Matrix4(sopr.matrix);
	  sopr3.matrix = sopra3;
	  sopr3.color = [0.3, 0.75, 0.5, .99];
	  sopr3.matrix.translate(-0.35, -0.15, 0.1);
	  //sopr3.matrix.rotate(body_angle, 1, 0, 1);
	  sopr3.matrix.scale(1.7, 1, 1.7);
	  sopr3.render();
	 
	  sopr.matrix.translate(-0.4, .85, 0.01);
	  sopr.matrix.rotate(body_angle/10, 1, 1, 0);
	  sopr.matrix.scale(1.8, .1, 1);
	  sopr.render();
	   
	   //bottom undergarm
	   var botr = new Cube();
	   var botra = new Matrix4(body.matrix);
	   botr.matrix = botra;
   
		 botr.color = [0.4, 0.85, 0.4, .99];
	 
	   botr.matrix.translate(-0.08, -0.01, -0.3);
	   botr.matrix.rotate(0, 0, 0, 1);
	   botr.matrix.scale(1.2, .35, 1.44);
	   botr.render();
	   //bottom undergarm hip 1
	   var botr1 = new Cube();
	   var botra1 = new Matrix4(botr.matrix);
	   botr1.matrix = botra1;
	 
		 botr1.color = [0.4, 0.85, 0.4, .99];
		 
	   botr1.matrix.translate(-0.1, -0.28, -0.01);
	   botr1.matrix.rotate(4, 0, 0, 1);
	   botr1.matrix.rotate(lleg_angle/2, 0, 0, -1);
	   botr1.matrix.scale(0.5, 1, 1.2);
	   botr1.render();
	   //bottom undergarm hip 2
	   var botr2 = new Cube();
	   var botra2 = new Matrix4(botr.matrix);
	   botr2.matrix = botra2;
   
		 botr2.color = [0.4, 0.85, 0.4, .99];
		
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
	 
	   toprs.color = [0.4, 0.85, 0.4, .99];
	 
	  toprs.matrix.translate(0.1, .8, -0.07);
	  toprs.matrix.rotate(20, 0, 0, 1);
	  toprs.matrix.scale(0.1, .2, 1.2);
	  toprs.render();
   
	  //top undergarm strap right
	  var toprs2 = new Cube();
	  var topras2 = new Matrix4(body.matrix);
	  toprs2.matrix = topras2;
	 
	   toprs2.color = [0.4, 0.85, 0.4, .99];
	 
	  toprs2.matrix.translate(0.75, .8, -0.07);
	  toprs2.matrix.rotate(-20, 0, 0, 1);
	  toprs2.matrix.scale(0.1, .24, 1.2);
	  toprs2.render();
   
	 
   
	 //draw head
	 var head = new Cube();
	 head.matrix = new Matrix4(neck.matrix);
   
	   head.color = [0.4, 0.85, 0.4, .99];
	 
	 head.matrix.translate(-1.5, 1.2, -1.8);
	 //head.matrix.rotate(head_angle/2, -1, 1, 0);
	 head.matrix.scale(4, 3, 6);
	 head.render();
   
	
   
	 //round face
	 var facer = new Circle();
	 var facera = new Matrix4(neck.matrix);
	 facer.matrix = facera;
	   facer.color = [0.4, 0.85, 0.4, .99];
	   facer.matrix.translate(0.45, 2.7, 1.1);
	 //facer.matrix.rotate(head_angle, -1, 0, 1);
	 facer.matrix.scale(2.9, 2, 4);
	   
	 
	 facer.render();
	 
	 //right arm
	 var armr = new Cube();
	 armr.matrix = new Matrix4(sopra.matrix);
   
	   armr.color = [0.3, 0.75, 0.5, .99];
	   armr.matrix.setTranslate(.07, 0.12, 0.12);
	 armr.matrix.rotate(55, 0, 0, 1);
	 armr.matrix.rotate(-rarm_angle/1.5+30, -1, 0, -1);
	 //armr.matrix.rotate(body_angle, 1, 0, 0);
	 armr.matrix.scale(.05, -0.65, -.05);
	
	 
	 armr.render();
   
	   //draw right hand
	   var armr2 = new Cube();
	   armr2.matrix = new Matrix4(armr.matrix);
   
		 armr2.color = [0.4, 0.85, 0.4, .99];
	 
	   armr2.matrix.translate(0, 1, 0);
	   armr2.matrix.rotate(13,1,0,0);
	   armr2.matrix.scale(0.8, .3, 0.8);
	   armr2.render();
   
	 //draw left arm
	 var arml = new Cube();
	 arml.matrix = new Matrix4(sopra.matrix);
   
	   arml.color = [0.3, 0.75, 0.5, .99];
	   arml.matrix.setTranslate(-.2, 0.16, 0.12);
	   arml.matrix.rotate(-55, 0, 0, 1);
	   arml.matrix.rotate(larm_angle/2+25, 1, -1, 1);
	 //arml.matrix.rotate(body_angle, 1, 1, 0);
	 arml.matrix.scale(.05, -0.65, -.05);
   
	 
	 arml.render();
   
	 //left hand
	 var arml2 = new Cube();
	 var Leftarma2 = new Matrix4(arml.matrix);
	 arml2.matrix = Leftarma2;
	
	   arml2.color = [0.4, 0.85, 0.4, .99];
   
	  
	   arml2.matrix.translate(0, 1, 0);
	  
	   arml2.matrix.rotate(13,1,0,0);
	  
	   arml2.matrix.scale(0.8, .3, 0.8);
	 arml2.render();
	 
   
	 //top right leg
	 var legr = new Cube();
	 legr.matrix = new Matrix4(botr1.matrix);
   
	   legr.color = [0.4, 0.85, 0.4, .99];
	   legr.matrix.setTranslate(-0.15, -0.19, 0.08);
	   legr.matrix.rotate(180, 1, 0, 0);
	   //legr.matrix.rotate(lleg_angle*2,0,0,1);
	   legr.matrix.rotate(lleg_angle,1,0,-1);
	   legr.matrix.scale(.07, 0.35, 0.1);
	 
	   
	   legr.render();
   
	 //bot right leg
	 var legr2 = new Cube();
	 legr2.matrix = new Matrix4(legr.matrix);
   
	   legr2.color = [0.8, 0.5, 0.2, .99];
	   legr2.matrix.translate(0.2, 0.7, .65);
	 legr2.matrix.rotate(90, 0, 1, 0);
	 legr2.matrix.rotate(-lleg_angle2*2,-1,0,0);
	 //legr2.matrix.rotate(lleg_angle2*2,0,0,-1);
	 legr2.matrix.scale(.5, 1.2, 0.5);
	  
	 
	 legr2.render();
   
   
   
	 //top right leg
	 var legl1 = new Cube();
	 legl1.matrix = new Matrix4(botr2.matrix);
	   legl1.color = [0.4, 0.85, 0.4, .99];
	   legl1.matrix.setTranslate(0, -0.19, 0.1);
	   legl1.matrix.rotate(180, 1, 0, 0);
	   legl1.matrix.rotate(joint_angle,0,0,1);
	   legl1.matrix.rotate(joint_angle/2,-1,0,0);
	   legl1.matrix.scale(.07, 0.35, 0.1);
	 
	   
	   legl1.render();
   
	 //bot right leg
	 var legl2 = new Cube();
	 legl2.matrix = new Matrix4(legl1.matrix);
	
	   legl2.color = [0.8, 0.5, 0.2, .99];
	   legl2.matrix.translate(0.2, 0.7, .2);
	 legl2.matrix.rotate(0, 0, 1, 0);
	 legl2.matrix.rotate(joint_angle*2,-1,0,0); 
	 legl2.matrix.rotate(joint_angle*2,0,0,-1);
	 legl2.matrix.scale(.5, 1.2, 0.5);
	  
	 legl2.render();
   



}