class Circle {
    //see youtube vids
    constructor() {
        this.type = 'sphere';
        this.segment = 9; 
        this.color = [1.0, 1.0, 1.0, 1.0]; 
        this.rads = 1;
        this.matrix = new Matrix4();
        this.vertexBuffer = null; 
        this.trig();
    }

    trig() {
        let vert = [];
        let next = Math.PI / this.segment;
        // similar to circle.js but do i and j iterations for 3d
        for (let angle1 = 0; angle1 < Math.PI; angle1 = angle1 + next) {
            for (let angle2 = 0; angle2 < 2 * Math.PI; angle2 += next) {
                vert = vert.concat(this.rads * Math.sin(angle1) * Math.cos(angle2),
                this.rads * Math.sin(angle1) * Math.sin(angle2),
                this.rads * Math.cos(angle1));
                vert = vert.concat(this.rads * Math.sin(angle1+ next) * Math.cos(angle2),
                this.rads * Math.sin(angle1 + next) * Math.sin(angle2),
                this.rads * Math.cos(angle1 + next));
                vert = vert.concat(this.rads * Math.sin(angle1) * Math.cos(angle2+ next),
                this.rads * Math.sin(angle1) * Math.sin(angle2+ next),
                this.rads * Math.cos(angle1));
                vert = vert.concat(this.rads * Math.sin(angle1+ next) * Math.cos(angle2+ next),
                this.rads * Math.sin(angle1+ next) * Math.sin(angle2+ next),
                this.rads * Math.cos(angle1+ next));
                vert = vert.concat(this.rads * Math.sin(angle1) * Math.cos(angle2+ next),
                this.rads * Math.sin(angle1) * Math.sin(angle2+ next),
                this.rads * Math.cos(angle1));
                vert = vert.concat(this.rads * Math.sin(angle1+ next) * Math.cos(angle2),
                this.rads * Math.sin(angle1 + next) * Math.sin(angle2),
                this.rads * Math.cos(angle1 + next));
            }
        }
        this.vert = new Float32Array(vert);
        this.vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vert, gl.STATIC_DRAW);
    }


    render() { // same as 3d triangle but the last param in draw arrays becomes this.vert.length/3
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);
        gl.drawArrays(gl.TRIANGLES, 0, this.vert.length / 3);
    }
}