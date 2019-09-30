function main()
{
    var canvas = document.getElementById('gl-canvas');
    var gl = canvas.getContext('webgl');

    // initialize shaders
    if (program = initShaderProgram(gl))
    {
        gl.useProgram(program);
        var position = gl.getAttribLocation(program, 'position');
        var color = gl.getUniformLocation(program, 'color');
    }
    else
    {
        return;
    }
    
    // draw the rotating flag
    animate();

    function animate(){
        // set the background white
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // black color
        gl.uniform3f(color, 0.0, 0.0, 0.0);
        // draw four GUA diagrams
        // position information is stored in 'points.js'
        [QIAN, KUN, KAN, LI].forEach(function(GUA){
            GUA.forEach(drawPolygon)});
        
        // If you don't want the taichi to rotate, just comment out this line
        updateTheta();

        // draw two big semicircles first, then draw two small semicircles
        drawSemicircle(0, 0, 0.5, red, direction['up']);
        drawSemicircle(0, 0, 0.5, blue, direction['down']);
        drawSemicircle(smallX, -smallY, 0.25, blue, direction['up']);
        drawSemicircle(-smallX, smallY, 0.25, red, direction['down']);
        gl.flush();
        requestAnimationFrame(animate);
    };

    // update the angle of the central axis
    var theta = Math.atan(2.0/3.0);
    var timeLast = Date.now();
    function updateTheta()
    {
        var timeNow = Date.now();
        var timePast = timeNow - timeLast;
        timeLast = timeNow;
        theta -= timePast / 500;
    }
    
    // draw a rectangle with vertexes arranged to fit gl.TRIANGLE_FAN
    // parameter: an array of the horizontal and vertical coordinates
    function drawPolygon(vertex)
    {
        vertex = new Float32Array(vertex);
        // create a buffer and bind it to the program, then assign data and pointer
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertex, gl.STATIC_DRAW);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(position);
        // draw the polygon
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertex.length/2);
    }
    
    // draw a semicircle
    // parameters: the coordinate of the center, the radius, the slope angel
    function drawSemicircle(centerX, centerY, r, semiColor, direc)
    {
        // calculate the coordinates of the border
        gl.uniform3f(color, semiColor[0], semiColor[1], semiColor[2]);
        vertex = [centerX / 1.5, centerY];
        for (var i = direc * Math.PI - theta ; i <= (1 + direc) * Math.PI - theta + 0.001; i += 0.001)
        {
            vertex.push((centerX + r * Math.cos(i)) / 1.5);
            vertex.push((centerY + r * Math.sin(i)));
        }
        // approach the circle to a polygon
        drawPolygon(vertex);
    }
}

// initialize shaders
function initShaderProgram(gl)
{
    // get shader source codes from HTML document
    var vSource = document.getElementById('vShader').text;
    var fSource = document.getElementById('fShader').text;
    const vShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);

    // link shaders
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vShader);
    gl.attachShader(shaderProgram, fShader);
    gl.linkProgram(shaderProgram);
    
    // return the linked program
    if (gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    {
        return shaderProgram;
    }
    else
    {
        return null;
    }
}

// compile shader source codes
function loadShader(gl, type, source)
{
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        return shader;
    }
    else
    {
        return null;
    }
}