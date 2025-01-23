class Circle{
    constructor(){
        this.type = 'circle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [0.0, 0.0, 0.0, 1.0];
        this.size = 5.0;
        this.segments = 5;
    }
    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;
        var Segments = this.segments;
    
        var d = this.size/200.0;

        let next = 360/Segments;
        for(var angle = 0; angle < 360; angle=angle+next){
            var centerPt = [xy[0], xy[1]];
            
            // sorry i had to break it up because i messed something up in here
            var angle1 = angle;
            var temp = angle1*Math.PI/180;
            var temp3 = Math.cos(temp)*d;
            var temp4 =  Math.sin(temp)*d;
            var vec1 = [temp3,temp4];

            var nextangle = angle + next;
            var temp2 = nextangle*Math.PI/180;
            var temp5 = Math.cos(temp2)*d;
            var temp6 = Math.sin(temp2)*d;
            var vec2 = [temp5, temp6];

            var temp7 = centerPt[0]+vec1[0];
            var temp8 = centerPt[1]+vec1[1];
            var pt1 = [temp7, temp8];
            var pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

            drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]], rgba);
        }
    }
}