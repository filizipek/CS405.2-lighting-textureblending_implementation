# CS 405 Project 2: Texture & Illumination

## Overview

This project implements texture mapping and lighting techniques using WebGL. It allows users to upload 3D models and textures, adjust lighting parameters, and explore different shading effects.

## Features

### 1. Non-Power-of-Two Textures
- **Functionality:** Supports textures of any size, not just those with dimensions that are powers of two.
- **Implementation:** Modified the `setTexture` method to use linear filtering and clamp-to-edge wrapping for non-power-of-two images.

### 2. Basic Lighting (Ambient and Diffuse)
- **Functionality:** Adds ambient and diffuse lighting to enhance the realism of 3D models.
- **Implementation:** Updated shaders and JavaScript to include ambient light density and diffuse light based on surface normals and light position.
- **Controls:** Use the "Enable Light" checkbox and adjust the "Ambient Light Density" slider.

### 3. Specular Lighting (Phong Shading)
- **Functionality:** Introduces specular highlights to simulate shiny surfaces.
- **Implementation:** Implemented the Phong reflection model in the fragment shader and added a "Specular Light Intensity" slider.
- **Controls:** Adjust the "Specular Light Intensity" slider to change the shininess of the material.

### 4. Multiple Texture Blending
- **Functionality:** Allows blending of two textures for more complex material appearances.
- **Implementation:** Extended the `setTexture` method to handle a second texture and added controls to enable blending and swap textures.
- **Controls:** Use the "Enable Blend" and "Change Texture" checkboxes to manage texture blending.

## Usage

### Open the Application:
- Open `project2.html` in a web browser (e.g., Chrome, Firefox).

### Upload Models and Textures:
- **OBJ Model:** Click the "OBJ model" button to upload a `.obj` file.
- **Texture Images:** Upload a texture using the "Texture image" button and an optional second texture with the "Second Texture image" button.

### Adjust Lighting:
- **Enable Light:** Check the "Enable Light" box to activate lighting.
- **Ambient Light Density:** Use the slider to adjust ambient lighting.
- **Specular Light Intensity:** Use the slider to adjust specular highlights.
- **Move Light Source:** Use the arrow keys on your keyboard to change the light's position.

### Texture Blending:
- **Enable Blend:** Check the "Enable Blend" box to blend two textures.
- **Change Texture:** Check the "Change Texture" box to swap between the first and second textures.

### Additional Controls:
- **Show Box:** Toggle the "Show Box" checkbox to display a bounding box.
- **Auto Rotation:** Enable automatic rotation with the "Auto Rotation" checkbox and adjust speed with the slider.

---

**Author:** Filiz İpek Oktay  
**Course:** CS 405 - Computer Graphics  
**Date:** December 3, 2024
