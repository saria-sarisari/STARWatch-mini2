// JavaScript
function createStarPath(cx, cy, outerRadius, innerRadius, points) {
  const angle = Math.PI / points;
  let path = '';
  
  for (let i = 0; i < 2 * points; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = cx + radius * Math.sin(i * angle);
    const y = cy - radius * Math.cos(i * angle);
    path += (i === 0 ? 'M' : 'L') + ' ' + x + ',' + y + ' ';
  }
  
  return path + 'Z';
}

function getHandEndPoint(angle, length, cx, cy) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + length * Math.cos(rad),
    y: cy + length * Math.sin(rad)
  };
}

const cx = 100;
const cy = 100;

// 星の形を作成
const outerStar = document.getElementById('outerStar');
const outerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
outerPath.setAttribute('d', createStarPath(cx, cy, 95, 45, 5));
outerPath.setAttribute('fill', 'url(#starGradient)');
outerPath.setAttribute('stroke', '#ff6b9d');
outerPath.setAttribute('stroke-width', '1.5');
outerPath.setAttribute('filter', 'url(#glow)');
outerStar.appendChild(outerPath);

const innerStar = document.getElementById('innerStar');
const innerPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
innerPath.setAttribute('d', createStarPath(cx, cy, 85, 40, 5));
innerPath.setAttribute('fill', '#ffffff');
innerPath.setAttribute('stroke', '#129ab5');
innerPath.setAttribute('stroke-width', '1');
innerStar.appendChild(innerPath);

// 時刻マーカーを作成
const markers = document.getElementById('markers');
for (let i = 0; i < 12; i++) {
  const angle = (i * 30 - 90) * Math.PI / 180;
  const x = cx + 70 * Math.cos(angle);
  const y = cy + 70 * Math.sin(angle);
  const r = i % 3 === 0 ? 2.5 : 1.5;
  const color = i % 3 === 0 ? '#129ab5' : '#ff6b9d';
  
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', color);
  markers.appendChild(circle);
}

// 中心の装飾を作成
const centerDeco = document.getElementById('centerDeco');
const circles = [
  { r: 10, fill: 'url(#centerGlow)', stroke: 'none' },
  { r: 6, fill: '#ffffff', stroke: '#129ab5', strokeWidth: 1 },
  { r: 3, fill: '#129ab5', stroke: 'none' }
];

circles.forEach(c => {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', c.r);
  circle.setAttribute('fill', c.fill);
  if (c.stroke !== 'none') {
    circle.setAttribute('stroke', c.stroke);
    circle.setAttribute('stroke-width', c.strokeWidth);
  }
  centerDeco.appendChild(circle);
});

// 時計の針を取得
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const digitalTime = document.getElementById('digitalTime');
const dateDisplay = document.getElementById('dateDisplay');

function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const secondAngle = (seconds * 6) - 90;
  const minuteAngle = (minutes * 6 + seconds * 0.1) - 90;
  const hourAngle = (hours * 30 + minutes * 0.5) - 90;

  const hourEnd = getHandEndPoint(hourAngle, 35, cx, cy);
  const minuteEnd = getHandEndPoint(minuteAngle, 50, cx, cy);
  const secondEnd = getHandEndPoint(secondAngle, 60, cx, cy);

  hourHand.setAttribute('x2', hourEnd.x);
  hourHand.setAttribute('y2', hourEnd.y);
  minuteHand.setAttribute('x2', minuteEnd.x);
  minuteHand.setAttribute('y2', minuteEnd.y);
  secondHand.setAttribute('x2', secondEnd.x);
  secondHand.setAttribute('y2', secondEnd.y);

  const displayHours = hours === 0 ? 12 : hours;
  digitalTime.textContent = 
    String(displayHours).padStart(2, '0') + ':' + 
    String(minutes).padStart(2, '0') + ':' + 
    String(seconds).padStart(2, '0');

  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

updateClock();
setInterval(updateClock, 1000);