class Camera {
    constructor() {
        this.type = 'camera';
        this.fov = 60.0;
        this.eye = new Vector3([5, 2, -10]); 
        this.at = new Vector3([-10, 0, 100]);
        this.up = new Vector3([0, 5, 0]); 
        this.speed = 0.5;
        this.bounds = { minX: -50, maxX: 50, minZ: -50, maxZ: 50 }; 
    }
    walkl() {
        var forwardDirection = new Vector3();
        forwardDirection.set(this.at);
        forwardDirection.sub(this.eye);
        var left = Vector3.cross(this.up, forwardDirection);
        left.normalize();
        left.mul(this.speed);
        this.eye.add(left);
        this.at.add(left);
    }
    
    walkr() {
        var forwardDirection = new Vector3();
        forwardDirection.set(this.at);
        forwardDirection.sub(this.eye);
        var right = Vector3.cross(forwardDirection, this.up);
        right.normalize();
        right.mul(this.speed);   
        this.eye.add(right);
        this.at.add(right);
    }

    updateCameraPosition(vector) {
        this.eye.add(vector);
        this.at.add(vector);
    }

    looku(){
        this.at.elements[1] += 2;
    }

    lookd(){
        this.at.elements[1] -= 2;
    }

    walku(distance) {
        this.eye.elements[1] += distance;
        this.at.elements[1] += distance;
    }

    walkd(distance) {
        this.eye.elements[1] -= distance;
        this.at.elements[1] -= distance;
    }

    walkf() {
        var forwardDirection = new Vector3();
        forwardDirection.set(this.at);
        forwardDirection.sub(this.eye);
        forwardDirection.normalize();
        forwardDirection.elements[1] = 0;
        forwardDirection.normalize();
        forwardDirection.mul(this.speed);
        this.eye.add(forwardDirection);
        this.at.add(forwardDirection);
    }
    
    walkb() {
        var backwardDirection = new Vector3();
        backwardDirection.set(this.eye);
        backwardDirection.sub(this.at);
        backwardDirection.normalize();
        backwardDirection.elements[1] = 0;
        backwardDirection.normalize();
        backwardDirection.mul(this.speed);
        this.eye.add(backwardDirection);
        this.at.add(backwardDirection);
    }
    

    lookl(){
        
        var LRight = new Vector3;
        // at FIRST then eye or wonky
        LRight.set(this.at);
        LRight.sub(this.eye);
        var radius = Math.sqrt(LRight.elements[0]*LRight.elements[0] + LRight.elements[2]*LRight.elements[2]);
        var theta = Math.atan2(LRight.elements[2], LRight.elements[0]);
        theta -= (2 * Math.PI / 180);
        LRight.elements[0] = radius * Math.cos(theta);
        LRight.elements[2] = radius * Math.sin(theta);
        this.at.set(LRight);
        this.at.add(this.eye);
    }

    lookr(){
        var LLeft = new Vector3;
        // at FIRST then eye or wonky
        LLeft.set(this.at);
        LLeft.sub(this.eye);
        var radius = Math.sqrt(LLeft.elements[0] * LLeft.elements[0] + LLeft.elements[2] * LLeft.elements[2]);
        var theta = Math.atan2(LLeft.elements[2], LLeft.elements[0]);
        theta += (2 * Math.PI / 180);
        LLeft.elements[0] = radius * Math.cos(theta);
        LLeft.elements[2] = radius * Math.sin(theta);
        this.at.set(LLeft);
        this.at.add(this.eye);
    }

    getForwardDirection() {
        let forward = new Vector3();
        // at FIRST then eye or wonky
        forward.set(this.at);
        forward.sub(this.eye);
        forward.normalize();
        return forward;
    }

    mousePanX(alpha) {
        var f = new Vector3();
        // at FIRST then eye or wonky
        f.set(this.at);
        f.sub(this.eye);
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(1*alpha, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }
    
    mousePanY(alpha) {
        let f = new Vector3();
        // at FIRST then eye or wonky
        f.set(this.at);
        f.sub(this.eye);
        let s = Vector3.cross(f, this.up);
        s.normalize();
        let rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(alpha, s.elements[0], s.elements[1], s.elements[2]);
        let f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }
}
