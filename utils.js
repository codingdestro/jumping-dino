let imageStack = [];
export const loadImages = (src) => {
  let img = new Image();
  imageStack.push(true);
  img.src = src;
  img.onload = () => {
    console.log(imageStack.length);
    imageStack.pop();
  };
  return img;
};
//random number generator between min and max
export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};
