class Cube{
    constructor(){
        this.type = 'Cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.uvBuffer = null;
        this.uvvertices = null;
        this.textureNum = -2;
        this.normalBuffer = null;
        this.normals = null;
        this.vertices = null;
        this.cubeBuffer = null;
    } // incorporated majority from last lab
    generateCubeSides() {
        const sides = ['front', 'back', 'top', 'bottom', 'right', 'left'];
        const vertexData = [];
        const vertices = {
            front: [0,0,0, 1,1,0, 1,0,0,
                 0,0,0, 0,1,0, 1,1,0],
            back: [0,0,1, 1,1,1, 1,0,1, 
                0,0,1, 0,1,1, 1,1,1],
            top: [0,1,0, 1,1,1, 1,1,0, 
                0,1,0, 0,1,1, 1,1,1],
            bottom: [0,0,0, 1,0,1, 1,0,0,
                0,0,0, 0,0,1, 1,0,1],
            right: [1,0,0, 1,1,1, 1,0,1, 
                1,0,0, 1,1,0, 1,1,1],
            left: [0,0,0, 0,1,1, 0,0,1,
                 0,0,0, 0,1,0, 0,1,1]
        };
    
        sides.forEach(side => {
            vertexData.push(...vertices[side]);
        });
    
        this.vertices = new Float32Array(vertexData);
    }
    
    generateUVcoords() {
        const sides = ['front', 'back', 'top', 'bottom', 'right', 'left'];
        const uvData = [];
        const uvCoords = {
            front: [0,0,1, 1,1,0, 
                0,0,0, 1,1,1],
            back: [1,0,0, 1,0,0, 
                1,0,1, 1,0,1],
            top: [0,0,1, 1,1,0, 
                0,0,0, 1,1,1],
            bottom: [0,1,1, 0,1,1, 
                0,1,0, 0,1,0],
            right: [0,0,1, 1,1,0, 
                0,0,0, 1,1,1],
            left: [0,0,1, 1,1,0, 
                0,0,0, 1,1,1]
        };
    
        sides.forEach(side => {
            uvData.push(...uvCoords[side]);
        });
    
        this.uvvertices = new Float32Array(uvData);
    }
    
    generateNormals() {
        const sides = ['front', 'back', 'top', 'bottom', 'right', 'left'];
        const normalsData = [];
        const normals = {
            front: [0,0,-1, 0,0,-1, 0,0,-1, 
                0,0,-1, 0,0,-1, 0,0,-1],
            back: [0,0,1, 0,0,1, 0,0,1,
                 0,0,1, 0,0,1, 0,0,1],
            top: [0,1,0, 0,1,0, 0,1,0,
                 0,1,0, 0,1,0, 0,1,0],
            bottom: [0,-1,0, 0,-1,0, 0,-1,0, 
                0,-1,0, 0,-1,0, 0,-1,0],
            right: [1,0,0, 1,0,0, 1,0,0,
                 1,0,0, 1,0,0, 1,0,0],
            left: [-1,0,0, -1,0,0, -1,0,0,
                 -1,0,0, -1,0,0, -1,0,0]
        };
    
        sides.forEach(side => {
            normalsData.push(...normals[side]);
        });
    
        this.normals = new Float32Array(normalsData);
    }
    // referenced youtube and old peer's, jasmine for debugging
    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        if (this.vertices == null){
            this.generateCubeSides();
        }
        if (this.cubeBuffer == null){
            this.cubeBuffer = gl.createBuffer();
            if (!this.cubeBuffer){
                console.log("Failed to cube buffer");
                return -1;
            }
        }
        if (this.uvvertices == null){
            this.generateUVcoords();
        }
        if (this.uvBuffer == null){
            this.uvBuffer = gl.createBuffer();
            if (!this.uvBuffer){
                console.log("Failed to create uv buffers");
                return -1;
            }
        }
        if(this.normals == null) {
            this.generateNormals();
        }
        if (this.normalBuffer === null) {
            this.normalBuffer = gl.createBuffer();
            if (!this.normalBuffer) {
                console.log("Failed to create the normal buffer object");
                return -1;
            }
        }

        drawCubeNormal(this.cubeBuffer, this.vertices, this.uvBuffer, this.uvvertices, this.normalBuffer, this.normals);
        
        
    }
}

function drawCubeUV(vertexBuffer, uvBufferer, vertexCount) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBufferer);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
}

function drawCube(buffer, offset, count) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, offset, count);
}

function drawCubeNormal(buffer, vertices, uvBufferer, uv, normBuffer, normals) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBufferer);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
}
