// vertex shader
var vSource = `
    attribute vec3 position;
    uniform vec3 center_position;

    uniform mat4 translationMatrix;
    uniform mat4 rotationXMatrix, rotationYMatrix;

    uniform vec3 color;
    varying vec3 v_color;

    void main()
    {
        gl_Position = rotationYMatrix * rotationXMatrix * translationMatrix * vec4(position, 1.0);
        if (center_position == vec3(0.0, 0.0, 0.0))
        {
            v_color = color * vec3(1.0, 1.0, 1.0) * max(dot(normalize(vec3(0.0, 0.0, 1.0)), normalize(-vec3(gl_Position))), 0.0);
        }
        else
        {
            v_color = color * vec3(1.0, 1.0, 1.0) * max(dot(normalize(center_position), normalize(center_position - position)), 0.0);
        }
    }
`;

// fragment shader
var fSource = `
    precision mediump float;
    varying vec3 v_color;
    void main()
    {
        gl_FragColor = vec4(v_color, 1.0);
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