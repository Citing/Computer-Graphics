// vertex shader
var vSource = `
    attribute vec3 position;
    uniform mat4 translationMatrix;
    uniform mat4 rotationXMatrix, rotationYMatrix;
    void main()
    {
        gl_Position = rotationYMatrix * rotationXMatrix * translationMatrix * vec4(position, 1.0);
    }
`;

// fragment shader
var fSource = `
    precision mediump float;
    uniform vec3 color;
    void main()
    {
        gl_FragColor = vec4(color, 1.0);
    }
`;

// initialize shaders
function initShaderProgram(gl)
{
    // load shaders from shader sources
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