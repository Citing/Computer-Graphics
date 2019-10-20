const red = [1.0, 0.0, 0.0];
const yellow = [1.0, 1.0, 0.0];
const blue = [0.0, 0.0, 1.0];
const darkYellow = [0.92941, 0.741176, 0.3960784];
const lightBlue = [0.756862745, 0.82352941, 0.941176470588];
const blueGreen = [0.2, 0.5372549, 0.45490196];
const lightYellow = [0.9607843, 0.9490196, 0.70196];
const aquaBlue = [0, 0.2705882, 0.41960784];
const gold = [1.0, 0.843137, 0.0];
const gray = [0.8, 0.8, 0.8];
const stars = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
const starColor = {
    'Mercury': lightBlue,
    'Venus': gold, 
    'Earth': aquaBlue, 
    'Mars': red, 
    'Jupiter': lightYellow, 
    'Saturn': darkYellow, 
    'Uranus': blueGreen, 
    'Neptune': blue,
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
const sunRadius = 0.12;
const delta_moonDistance = 0.002;
const delta_orbitAngleY = 0.1;
const delta_orbitAngleZ = 0.13;
const delta_scale = 0.05;
const delta_translation = 0.2;
const delta_mouse = 0.002;
const shpereDIV = 100;