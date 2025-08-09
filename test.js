import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('input.json', 'utf8'));

const n = data.keys.n;
const k = data.keys.k;
const degree = k - 1;

function decode(value, base) {
  return parseInt(value, base);
}

let points = [];

for (let key in data) {
  if (key === 'keys') continue;
  if (points.length >= k) break;

  const x = parseInt(key);
  const base = parseInt(data[key].base);
  const encodedY = data[key].value;
  const y = decode(encodedY, base);

  points.push({ x, y });
}

const A = [];
const Y = [];

points.forEach(({ x, y }) => {
  const row = [];
  for (let p = degree; p >= 0; p--) {
    row.push(Math.pow(x, p));
  }
  A.push(row);
  Y.push(y);
});

function gaussianElimination(A, b) {
  const n = A.length;

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
    }
    [A[i], A[maxRow]] = [A[maxRow], A[i]];
    [b[i], b[maxRow]] = [b[maxRow], b[i]];

    if (Math.abs(A[i][i]) < 1e-12) {
      throw new Error('Matrix is singular or nearly singular');
    }

    for (let k = i + 1; k < n; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
      b[k] -= factor * b[i];
    }
  }

  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = b[i];
    for (let j = i + 1; j < n; j++) {
      sum -= A[i][j] * x[j];
    }
    x[i] = sum / A[i][i];
  }
  return x;
}

try {
  const coeffs = gaussianElimination(A, Y);

  console.log('Value of c =', coeffs[coeffs.length - 1].toFixed(4));
} catch (e) {
  console.error('Error:', e.message);
}
