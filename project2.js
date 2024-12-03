/**
 * @Instructions
 * 		@task1 : Complete the setTexture function to handle non power of 2 sized textures
 * 		@task2 : Implement the lighting by modifying the fragment shader, constructor,
 *      @task3: 
 *      @task4: 
 * 		setMesh, draw, setAmbientLight, setSpecularLight and enableLighting functions 
 */


function GetModelViewProjection(projectionMatrix, translationX, translationY, translationZ, rotationX, rotationY) {
	
	var trans1 = [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		translationX, translationY, translationZ, 1
	];
	var rotatXCos = Math.cos(rotationX);
	var rotatXSin = Math.sin(rotationX);

	var rotatYCos = Math.cos(rotationY);
	var rotatYSin = Math.sin(rotationY);

	var rotatx = [
		1, 0, 0, 0,
		0, rotatXCos, -rotatXSin, 0,
		0, rotatXSin, rotatXCos, 0,
		0, 0, 0, 1
	]

	var rotaty = [
		rotatYCos, 0, -rotatYSin, 0,
		0, 1, 0, 0,
		rotatYSin, 0, rotatYCos, 0,
		0, 0, 0, 1
	]

	var test1 = MatrixMult(rotaty, rotatx);
	var test2 = MatrixMult(trans1, test1);
	var mvp = MatrixMult(projectionMatrix, test2);

	return mvp;
}


class MeshDrawer {
	// The constructor is a good place for taking care of the necessary initializations.
	constructor() {
		this.prog = InitShaderProgram(meshVS, meshFS);
		this.mvpLoc = gl.getUniformLocation(this.prog, 'mvp');
		this.showTexLoc = gl.getUniformLocation(this.prog, 'showTex');

		this.colorLoc = gl.getUniformLocation(this.prog, 'color');

		this.vertPosLoc = gl.getAttribLocation(this.prog, 'pos');
		this.texCoordLoc = gl.getAttribLocation(this.prog, 'texCoord');


		this.vertbuffer = gl.createBuffer();
		this.texbuffer = gl.createBuffer();

		this.numTriangles = 0;

		/**
		 * @Task2 : You should initialize the required variables for lighting here
		 */

		// Task 2: Add lighting-related uniform locations
		this.enableLightingLoc = gl.getUniformLocation(this.prog, 'enableLighting');
		this.lightPosLoc = gl.getUniformLocation(this.prog, 'lightPos');
		this.ambientLoc = gl.getUniformLocation(this.prog, 'ambient');
		this.normalBufferLoc = gl.createBuffer(); // Buffer for normals
		
		// Default lighting settings
		this.isLightingEnabled = false;
		this.ambientStrength = 0.1; // Default ambient light

		// Task 3: Add specular lighting-related uniform locations and properties
		this.shininessLoc = gl.getUniformLocation(this.prog, 'shininess');
		this.viewPosLoc = gl.getUniformLocation(this.prog, 'viewPos');

		// Default specular settings
		this.shininess = 32.0; // Default shininess (controls specular highlight size)

        this.enableBlendLoc = gl.getUniformLocation(this.prog, 'enableBlend'); // New uniform
		this.isBlendEnabled = false;

		//to change the texture
		this.changeTextureLoc = gl.getUniformLocation(this.prog, 'changeTexture'); 
		this.isChangeTextureOn = false;

		// Set default blend factor to 0.5 (50%)
		this.blendFactor = 0.5;
	}

	// New method to set specular light intensity
	setSpecularLight(intensity) {
		this.shininess = 1/intensity;
	}

	setMesh(vertPos, texCoords, normalCoords) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

		// update texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

		this.numTriangles = vertPos.length / 3;

		/**
		 * @Task2 : You should update the rest of this function to handle the lighting
		 */

		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferLoc);
    	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalCoords), gl.STATIC_DRAW);

	}

	// This method is called to draw the triangular mesh.
	// The argument is the transformation matrix, the same matrix returned
	// by the GetModelViewProjection function above.
	draw(trans) {
		gl.useProgram(this.prog);

		gl.uniformMatrix4fv(this.mvpLoc, false, trans);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertbuffer);
		gl.enableVertexAttribArray(this.vertPosLoc);
		gl.vertexAttribPointer(this.vertPosLoc, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texbuffer);
		gl.enableVertexAttribArray(this.texCoordLoc);
		gl.vertexAttribPointer(this.texCoordLoc, 2, gl.FLOAT, false, 0, 0);

		/**
		 * @Task2 : You should update this function to handle the lighting
		 */

		///////////////////////////////

		 // Task 2: Add normal attribute binding
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferLoc);
		const normalAttribLoc = gl.getAttribLocation(this.prog, 'normal');
		gl.enableVertexAttribArray(normalAttribLoc);
		gl.vertexAttribPointer(normalAttribLoc, 3, gl.FLOAT, false, 0, 0);

		// Set lighting uniforms
		gl.uniform1i(this.enableLightingLoc, this.isLightingEnabled);

		gl.uniform1i(this.enableBlendLoc, this.isBlendEnabled);

		// Update light position based on global lightX and lightY
		gl.uniform3f(this.lightPosLoc, lightX, lightY, 0.0);
		
		// Set ambient light
		gl.uniform1f(this.ambientLoc, this.ambientStrength);

		// Task 3: Set specular uniforms
		gl.uniform1f(this.shininessLoc, this.shininess);
		
		// Assuming a fixed view position for simplicity
		// In a more advanced implementation, this could be dynamic
		gl.uniform3f(this.viewPosLoc, 0.0, 0.0, -1.0);


		updateLightPos();
		gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);


	}

	EnableBlend(enable) {
        this.isBlendEnabled = enable;
        gl.useProgram(this.prog);
        gl.uniform1i(this.enableBlendLoc, this.isBlendEnabled ? 1 : 0);
    }

	ChangeTexture(enable) {
        this.isChangeTextureOn = enable;
        gl.useProgram(this.prog);
        gl.uniform1i(this.changeTextureLoc, this.isChangeTextureOn ? 1 : 0);
    }

	// This method is called to set the texture of the mesh.
	// The argument is an HTML IMG element containing the texture data.
	setTexture(img) {
		const texture = gl.createTexture();
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	
		// Set the texture image data
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img
		);
	
		// Set texture parameters for non-power-of-2 textures
		if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
	
		gl.useProgram(this.prog);
		// Activate and bind to texture unit 0
		gl.uniform1i(gl.getUniformLocation(this.prog, 'tex'), 0); // Bind to sampler 'tex'
	}
	
	setTexture2(img) {
		const texture2 = gl.createTexture();
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, texture2);
	
		// Set the texture image data
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGB,
			gl.RGB,
			gl.UNSIGNED_BYTE,
			img
		);
	
		// Set texture parameters for non-power-of-2 textures
		if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
			gl.generateMipmap(gl.TEXTURE_2D);
		} else {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
	
		gl.useProgram(this.prog);
	
		// Activate and bind to texture unit 1
		gl.uniform1i(gl.getUniformLocation(this.prog, 'tex2'), 1); // Bind to sampler 'tex2'
	}
	


	showTexture(show) {
		gl.useProgram(this.prog);
		gl.uniform1i(this.showTexLoc, show);
	}

	enableLighting(show) {
		console.error("Task 2: You should implement the lighting and implement this function ");
		/**
		 * @Task2 : You should implement the lighting and implement this function
		 */
		this.isLightingEnabled = show;

	}
	
	setAmbientLight(ambient) {
		console.error("Task 2: You should implement the lighting and implement this function ");
		/**
		 * @Task2 : You should implement the lighting and implement this function
		 */
		this.ambientStrength = ambient;

	}
}


function isPowerOf2(value) {
	return (value & (value - 1)) == 0;
}

function normalize(v, dst) {
	dst = dst || new Float32Array(3);
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	// make sure we don't divide by 0.
	if (length > 0.00001) {
		dst[0] = v[0] / length;
		dst[1] = v[1] / length;
		dst[2] = v[2] / length;
	}
	return dst;
}

// Update vertex shader to pass fragment position
const meshVS = `
	attribute vec3 pos; 
	attribute vec2 texCoord; 
	attribute vec3 normal;

	uniform mat4 mvp; 

	varying vec2 v_texCoord; 
	varying vec3 v_normal; 
	varying vec3 v_fragPos;

	void main()
	{
		v_texCoord = texCoord;
		v_normal =  mat3(mvp) * normal; //update the normal
		v_fragPos = pos;

		gl_Position = mvp * vec4(pos,1);
	}`;


const meshFS = `
	precision mediump float;

	uniform bool showTex;
	uniform bool enableLighting;
	uniform bool enableBlend; // New uniform to enable/disable blending
	uniform sampler2D tex;   // First texture sampler
	uniform sampler2D tex2;  // Second texture sampler
	uniform vec3 color; 
	uniform vec3 lightPos;
	uniform float ambient;
	uniform float shininess;
	uniform vec3 viewPos;
	uniform bool changeTexture; 

	varying vec2 v_texCoord;
	varying vec3 v_normal;
	varying vec3 v_fragPos;

	void main()
	{
		vec4 textureColor1 = texture2D(tex, v_texCoord);
		vec4 textureColor2 = texture2D(tex2, v_texCoord);
		
		if (changeTexture) {
			// Swap the textures by assigning to existing variables
			textureColor1 = texture2D(tex2, v_texCoord);
			textureColor2 = texture2D(tex, v_texCoord);
		}
		
		// Conditionally blend the textures
		vec4 blendedTexture;
		if (enableBlend) {
			blendedTexture = mix(textureColor1, textureColor2, 0.5);
		} else {
			blendedTexture = textureColor1;
		}

		if(showTex && enableLighting) {
			// Normalize the normal vector
			vec3 norm = normalize(v_normal);
			
			// Light direction
			vec3 lightDirection = normalize(-lightPos);
			
			// Compute cosine of the angle between surface normal and light direction
			float lightCos = dot(norm, lightDirection);
			
			// Reject specular highlights for surfaces facing away from the light
			if(lightCos > 0.0) {
				// Ambient light component
				vec3 ambientColor = ambient * blendedTexture.rgb;
				
				// Diffuse light component
				float diffuseStrength = lightCos;
				vec3 diffuseColor = diffuseStrength * blendedTexture.rgb;
				
				// Specular light component
				vec3 viewDir = normalize(viewPos);
				vec3 reflectDir = reflect(-lightDirection, norm);
				
				// Additional check to limit specular to front-facing surfaces
				float specularCos = max(dot(viewDir, reflectDir), 0.0);
				float spec = pow(specularCos, shininess);
				vec3 specularColor = spec * blendedTexture.rgb;
				
				// Combine ambient, diffuse, and specular lighting
				vec3 finalColor = ambientColor + diffuseColor + specularColor;
				gl_FragColor = vec4(finalColor, blendedTexture.a);
			}
			else {
				// For back-facing surfaces, use only ambient light
				vec3 finalColor = ambient * blendedTexture.rgb;
				gl_FragColor = vec4(finalColor, blendedTexture.a);
			}
		}
		else if(showTex) {
			// Use the blended texture directly
			gl_FragColor = blendedTexture;
		}
		else {
			// Default color if textures are not shown
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
	}
`;


// Light direction parameters for Task 2
var lightX = 1;
var lightY = 1;

const keys = {};
function updateLightPos() {
	const translationSpeed = 1;
	if (keys['ArrowUp']) lightY -= translationSpeed;
	if (keys['ArrowDown']) lightY += translationSpeed;
	if (keys['ArrowRight']) lightX -= translationSpeed;
	if (keys['ArrowLeft']) lightX += translationSpeed;
}
///////////////////////////////////////////////////////////////////////////////////