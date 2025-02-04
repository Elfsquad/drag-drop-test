const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let draggingData = null;
let draggingPosition = { x: 0, y: 0 };

const getData = (e) => {
  const data = e.dataTransfer.types[0];
  if (data) {
    return JSON.parse(decodeUpperCase(data));
  }
  return null;
};

const decodeUpperCase = (str) => {
  return str.replace(/<uppercase>(.*?)<\/uppercase>/g, (_, p1) => {
    return p1.toUpperCase();
  }, str);
};


canvas.addEventListener('dragover', (e) => {
  const rect = canvas.getBoundingClientRect();
  draggingPosition.x = e.clientX - rect.left;
  draggingPosition.y = e.clientY - rect.top;
  console.log('dragposition: ', [draggingPosition.x, draggingPosition.y]);

  if (!draggingData) {
    draggingData = getData(e);
  }


  if (draggingData) {
    drawData(draggingData, draggingPosition.x, draggingPosition.y);
  }
});

canvas.addEventListener('click', (e) => {
  console.log('click', [e.clientX, e.clientY]);
});

canvas.addEventListener('drop', (e) => {
  if (draggingData) {
    const rect = canvas.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    drawData(draggingData, dropX, dropY);
    draggingData = null;
  }
});

canvas.addEventListener('dragleave', (e) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.addEventListener('dragend', (e) => {
  draggingData = null;
});

/* CANVAS DRAWING */

const drawData = (data, x, y) => {
  const imageUrl = data.imageUrl;
  const name = data.name;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const image = new Image();
  image.src = imageUrl;

  image.onload = () => {
    const originalWidth = image.width;
    const originalHeight = image.height;

    const maxWidth = 100;
    const aspectRatio = originalWidth / originalHeight;

    let drawWidth = originalWidth;
    let drawHeight = originalHeight;

    if (drawWidth > maxWidth) {
      drawWidth = maxWidth;
      drawHeight = drawWidth / aspectRatio;
    }

    ctx.drawImage(image, x, y, drawWidth, drawHeight);

    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    const textX = x;
    const textY = y + drawHeight + 20;
    ctx.fillText(name, textX, textY);
  };
};

