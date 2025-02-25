class Cube {
    constructor() {
        this.type = 'cube';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        // see youtube vids 
        this.textureNum = -2;
        this.light = false; 
        this.vertexBuffer = null;
        this.uvBuffer = null;
        this.generateVertices(); 
    }
    // tried calling generateverts mult times asked for tips from alex to only do it once
    generateVertices() {
        const sides = ['front', 'back', 'top', 'bottom', 'right', 'left'];
        const vertexData = [];
        const uvData = [];
        const vertices = {
            front: [0,0,0,  1,1,0,  1,0,0,
                  0,0,0,  0,1,0,  1,1,0],
            back:  [0,0,1,  1,1,1,  1,0,1,
                  0,0,1,  0,1,1,  1,1,1],
            top:   [0,1,0,  1,1,1,  1,1,0,
                  0,1,0,  0,1,1,  1,1,1],
            bottom:   [0,0,0,  1,0,1,  1,0,0,
                  0,0,0,  0,0,1,  1,0,1],
            right: [1,0,0,  1,1,1,  1,0,1,
                  1,0,0,  1,1,0,  1,1,1],
            left:  [0,0,0,  0,1,1,  0,0,1,
                  0,0,0,  0,1,0,  0,1,1]
        };

        const uvCoords = {
            front: [0,0, 1,1, 1,0,
                 0,0, 0,1, 1,1],
            back:  [1,0, 0,1, 0,0,
                 1,0, 1,1, 0,1],
            top:   [0,0, 1,1, 1,0,
                 0,0, 0,1, 1,1],
            bottom:   [0,1, 1,0, 1,1,
                 0,1, 0,0, 1,0],
            right: [0,0, 1,1, 1,0,
                 0,0, 0,1, 1,1],
            left:  [0,0, 1,1, 1,0,
                 0,0, 0,1, 1,1]
        };
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators
        sides.forEach(side => {
            vertexData.push(...vertices[side]);
            uvData.push(...uvCoords[side]);
        });
        this.vertexBuffer = this.createBuffer(new Float32Array(vertexData));
        this.uvBuffer = this.createBuffer(new Float32Array(uvData));
    }

    createBuffer(data) {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    }

    translate(x, y, z) {
        this.matrix.translate(x, y, z);
    }

    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        if (this.light != true) {
            drawCubeUV(this.vertexBuffer, this.uvBuffer, 36); 
        } else {
            drawCube(this.vertexBuffer, 0, 36);
            gl.uniform4f(u_FragColor, rgba[0] + 0.18, rgba[1] + 0.18, rgba[2] + 0.18, rgba[3]);
            drawCube(this.vertexBuffer, 36, 36);
            gl.uniform4f(u_FragColor, rgba[0] * 0.95, rgba[1] * 0.95, rgba[2] * 0.95, rgba[3]);
            drawCube(this.vertexBuffer, 72, 36);
        }
    }
}

function drawCubeUV(vertexBuffer, uvBuffer, vertexCount) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
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
