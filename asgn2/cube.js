

class Cube{
  // see youtube vids
    constructor(){
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
    }
    //in the event we dont get a color we still need to render
   render(){
    //var xy = this.position;
    //https://www.researchgate.net/figure/Scheme-for-the-numerical-representation-of-a-cube-The-Vertices-matrix-contains-the_fig1_233375602
    var rgba = this.color;
    //adjust shades for depth
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    //face 1
    drawCube([0.0, 0.0, 0.0,    1.0, 1.0, 0.0,   1.0, 0.0, 0.0]);
    drawCube([0.0, 0.0, 0.0,    0.0, 1.0, 0.0,   1.0, 1.0, 0.0]);
    gl.uniform4f(u_FragColor, rgba[0]*.95, rgba[1]*.95, rgba[2]*.95, rgba[3]);
    //face 2
    drawCube([0.0, 1.0, 0.0,    0.0, 1.0, 1.0,   1.0, 1.0, 1.0]);
    drawCube([0.0, 1.0, 0.0,    1.0, 1.0, 1.0,   1.0, 1.0, 0.0]);
    // face 3
    drawCube([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
    drawCube([0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0]);
    // face 4
    gl.uniform4f(u_FragColor, rgba[0]*0.65, rgba[1]*0.65, rgba[2]*0.65, rgba[3]);
    drawCube([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
    drawCube([0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0]);
    // face 5
    drawCube([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
    drawCube([1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
    // face 6
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawCube([0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0]);
    drawCube([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);
  }
   
}

//Modify this function to take a Matrix parameter drawCube(Matrix M), that will apply this matrix when drawing the cube
function drawCube(Matrix_M){
  var n = 3; 
  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }
  drawTriangle3D(Matrix_M); 
}