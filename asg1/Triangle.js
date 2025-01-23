class Triangle{
  constructor(){
    this.type = 'triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 4.0;
  }
  render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;
    gl.uniform1f(u_size, size);
    var d = this.size/200.0;
    drawTriangle( [xy[0], xy[1], xy[0]+d, xy[1], xy[0], xy[1]+d], rgba);
  }
}
function drawTriangle(vertices, color){
  //verts
  var n = 3;
  var vertexBuffer = gl.createBuffer();
  if(!vertexBuffer){
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  gl.uniform4f(u_FragColor, color[0], color[1], color[2], color[3]);
  gl.drawArrays(gl.TRIANGLES, 0, n);  
}