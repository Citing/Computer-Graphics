const stars = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const stars_ = ['Sun', 'Moon', 'Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const starTexture = {
    'Sun': '../assets/sun.jpg',
    'Mercury': '../assets/mercury.jpg',
    'Venus': '../assets/venus.jpg', 
    'Earth': '../assets/earth.jpg', 
    'Mars': '../assets/mars.jpg', 
    'Jupiter': '../assets/jupiter.jpg', 
    'Saturn': '../assets/saturn.jpg', 
    'Uranus': '../assets/uranus.jpg', 
    'Neptune': '../assets/neptune.jpg',
    'Moon': '../assets/moon.jpg',
};
const starSize = {
    'Mercury': 0.03,
    'Venus': 0.036, 
    'Earth': 0.039, 
    'Mars': 0.033, 
    'Jupiter': 0.05, 
    'Saturn': 0.045, 
    'Uranus': 0.043, 
    'Neptune': 0.041,
};
const starDistance = {
    'Mercury': 0.2,
    'Venus': 0.3, 
    'Earth': 0.4, 
    'Mars': 0.5, 
    'Jupiter': 0.6, 
    'Saturn': 0.7, 
    'Uranus': 0.8, 
    'Neptune': 0.9,
};
const starYear = {
    'Mercury': 0.8,
    'Venus': 0.9, 
    'Earth': 1, 
    'Mars': 2, 
    'Jupiter': 5, 
    'Saturn': 6, 
    'Uranus': 10, 
    'Neptune': 13,
}
const asteroidNumber = 200;
const moonNumber = {
    'Mercury': 0,
    'Venus': 0, 
    'Earth': 1, 
    'Mars': 2, 
    'Jupiter': 16, 
    'Saturn': 23, 
    'Uranus': 17, 
    'Neptune': 8,
}

const moonRadius = 0.002;
const sunRadius = 0.11;
const delta_moonDistance = 0.002;
const delta_orbitAngleY = 0.1;
const delta_orbitAngleZ = 0.13;
const delta_scale = 0.05;
const delta_translation = 0.2;
const delta_mouse = 0.002;
const shpereDIV = 50;