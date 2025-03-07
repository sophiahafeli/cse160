class Sphere {
  constructor() {
      this.type = 'sphere';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -2;
      this.verts32 = new Float32Array([]);
  }
  render(){
      var rgba = this.color;
      var temp = Math.PI/10;
      var temp2= temp;
      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
      for(var i=0; i<Math.PI; i+=temp){
          for(var r=0; r<(2*Math.PI); r+=temp){
              var v = [];
              var u = [];
              var a = Math.PI;
              var x = Math.sin(i);
              var y = Math.cos(r);
              var z = Math.sin(r);
              var w = Math.cos(i);
              var s = Math.sin(i+temp2);
              var t = Math.cos(i+temp2);
              var o = Math.sin(r+temp2);
              var p = Math.cos(r+temp2);
              var p1 = [x*y, x*z, w];
              var p2 = [s*y, s*z, t];
              var p3 = [x*p, x*o, w];
              var p4 = [s*p, s*o, t];
              var u1 = [i/a, r/(2*a)];
              var u2 = [(i+temp2)/a, r/(2*a)];
              var u3 = [i/a, (r+temp2)/(2*a)];
              var u4 = [(i+temp2)/a, (r+temp2)/(2*a)];
              v = v.concat(p1); 
              v = v.concat(p2); 
              v = v.concat(p4); 
              u = u.concat(u1);
              u = u.concat(u2);
              u = u.concat(u4);
              gl.uniform4f(u_FragColor, 1,1,1,1);
              drawTriangleUVNormal(v,u,v);
              var v = [];
              var u = [];
              v = v.concat(p1); 
              v = v.concat(p3);
              v = v.concat(p4); 
              u = u.concat(u1);
              u = u.concat(u3);
              u = u.concat(u4);
              gl.uniform4f(u_FragColor, 1,1,1,1);
              drawTriangleUVNormal(v,u,v);
          }
      }
  }
}
// see youtube
function drawTriangleUVNormal(vertices, u, normals) {
  var n = vertices.length / 3;
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
  var uvBuffer = gl.createBuffer();
  if (!uvBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(u), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_UV);
  var normalBuffer = gl.createBuffer();
  if (!normalBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.DYNAMIC_DRAW);
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);
  gl.drawArrays(gl.TRIANGLES, 0, n);
  return n;
}