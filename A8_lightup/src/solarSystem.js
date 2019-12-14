function main()
{
    var canvas = document.getElementById('gl-canvas');
    var gl = canvas.getContext('webgl');

    // initialize shaders
    if (program = initShaderProgram(gl))
    {
        gl.useProgram(program);
        var position = gl.getAttribLocation(program, 'position');
        var center_position = gl.getUniformLocation(program, 'center_position');
        var color = gl.getUniformLocation(program, 'color');
        var translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
        var rotationXMatrix = gl.getUniformLocation(program, 'rotationXMatrix');
        var rotationYMatrix = gl.getUniformLocation(program, 'rotationYMatrix');
    }
    else
    {
        return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);

    var Tx = 0.0, Ty = 0.0, Tz = 0.0, theta_x = 0.0, theta_y = 0.0;
    var mousePosition = {x:-1, y:-1};

    // hangle with the keyboard events
    document.addEventListener('keydown', ()=>{
        switch (window.event.keyCode)
        {
            // W
            case 87:
                Tz += delta_translation;
                break;
            // S
            case 83:
                Tz -= delta_translation;
                break;
            // A
            case 65:
                Tx += delta_translation;
                break;
            //D
            case 68:
                Tx -= delta_translation;
                break;
        }}, false);
    //handle with the mouse events
    document.addEventListener('mousedown', (e)=>{
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;
        }, false);
    document.addEventListener('mouseup', (e)=>{
        var moveX = mousePosition.x - e.pageX;
        var moveY = mousePosition.y - e.pageY;
        theta_x = moveY * delta_mouse;
        theta_y = moveX * delta_mouse;
    }, false);

    var asteroid = new Array();
    for (var i = 0; i < asteroidNumber; ++i)
    {
        var planet = {
            distance: ((Math.random() * 0.01 + starDistance['Mars']) * (Math.random()>0.5 ? 1 : -1)),
            coordinateY: (Math.random() * 0.1 * (Math.random()>0.5 ? 1 : -1)),
            coordinateZ: (Math.random() * 0.1) * (Math.random()>0.5 ? 1 : -1),
            year: (starYear['Mars'] + Math.random() * 0.1),
        };
        asteroid.push(planet);
    }

    render();

    function render() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.uniformMatrix4fv(translationMatrix, false, [
            1.0, 0.0, 0.0, Tx,
            0.0, 1.0, 0.0, Ty,
            0.0, 0.0, 1.0, Tz,
            0.0, 0.0, 0.0, 1.0
        ]);

        gl.uniformMatrix4fv(rotationXMatrix, false, [
            1.0, 0.0, 0.0, 0.0,
            0.0, Math.cos(theta_x), Math.sin(theta_x), 0.0,
            0.0, -Math.sin(theta_x), Math.cos(theta_x), 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);
        gl.uniformMatrix4fv(rotationYMatrix, false, [
            Math.cos(theta_y), 0.0, -Math.sin(theta_y), 0.0,
            0.0, 1.0, 0.0, 0.0,
            Math.sin(theta_y), 0.0, Math.cos(theta_y), 0.0,
            0.0, 0.0, 0.0, 1.0
        ]);

        // draw sun
        drawSphere(yellow, 0.0, 0.0, 0.0, sunRadius);
        // draw plantes
        var timePast = updateTime();
        stars.forEach((starName)=>{
            var starX = starDistance[starName] * Math.cos(timePast / starYear[starName]);
            var starY = 0.0;
            var starZ = starDistance[starName] * Math.sin(timePast / starYear[starName]);
            // draw satellites
            drawSphere(starColor[starName], starX, starY, starZ, starSize[starName]);
            for (var i = 1; i <= moonNumber[starName]; ++i)
            {
                var moonPosition = getMoonPosition(starName, i, timePast);
                drawSphere(gray, starX + moonPosition[0], starY + moonPosition[1], starZ + moonPosition[2], moonRadius);
            }
        });
        // draw asteroid belts
        asteroid.forEach((smallPlanet)=>{
            drawSphere(gray, smallPlanet.distance * Math.cos(timePast / planet.year), (Math.random() * 0.01), smallPlanet.coordinateZ * Math.sin(timePast / planet.year), moonRadius);
        });
        requestAnimationFrame(render);
    }

    // calculate the position of a satellite of a planet
    // position is rotating around the satellite
    // orbit is rotated by the Y axis first, the rotated by the Z axis
    function getMoonPosition(starName, orbit, timePast)
    {
        var moonDistance = starSize[starName] + orbit * delta_moonDistance;
        var angle = timePast / (0.1 * orbit);
        var orbitAngleY = (orbit - 1) * delta_orbitAngleY;
        var orbitAngleZ = (orbit - 1) * delta_orbitAngleZ;
        var moonX0 = 0;
        var moonY0 = moonDistance * Math.sin(angle);
        var moonZ0 = moonDistance * Math.cos(angle);
        var moonX1 = moonX0 * Math.cos(orbitAngleY) - moonZ0 * Math.sin(orbitAngleY);
        var moonY1 = moonY0;
        var moonZ1 = moonX0 * Math.sin(orbitAngleY) + moonZ0 * Math.cos(orbitAngleY);
        var moonX2 = moonX1 * Math.cos(orbitAngleZ) + moonY1 * Math.sin(orbitAngleZ);
        var moonY2 = -moonX1 * Math.sin(orbitAngleZ) + moonY1 * Math.cos(orbitAngleZ);
        var moonZ2 = moonZ1;
        return [moonX2, moonY2, moonZ2];
    }

    // calculate the past time to control the animation
    var timeLast = Date.now();
    function updateTime()
    {
        var timeNow = Date.now();
        return (timeNow - timeLast) / 1000;
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
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(position);
        // draw the polygon
        gl.drawArrays(gl.TRIANGLE_FAN, 0, vertex.length / 3);
    }

    // to draw a sphere
    function drawSphere(sphereColor, centerX, centerY, centerZ, radius)
    {
        var vertex = [centerX, centerY, centerZ];
        // calculate the vertexes of the sphere
        for (var i = 0; i < shpereDIV; ++i)
        {
            var theta = 2 * Math.PI / shpereDIV * i;
            var cos_theta = Math.cos(theta);
            var sin_theta = Math.sin(theta);
            for (var j = 0; j < shpereDIV; ++j)
            {
                var alpha = 2 * Math.PI / shpereDIV * j;
                var cos_alpha = Math.cos(alpha);
                var sin_alpha = Math.sin(alpha);
                vertex.push(centerX + sin_theta * cos_alpha * radius);
                vertex.push(centerY + sin_theta * sin_alpha * radius);
                vertex.push(centerZ + cos_theta * radius);
            }
        }

        gl.uniform3f(color, sphereColor[0], sphereColor[1], sphereColor[2]);
        gl.uniform3f(center_position, centerX, centerY, centerZ);
        drawPolygon(vertex);
    }
}