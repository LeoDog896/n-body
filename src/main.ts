import './style.css'

const canvas = document.querySelector('canvas')!

const ctx = canvas.getContext('2d')!

let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

type Vector = [x: number, y: number];

type Entity = {
  mass: number;
  position: Vector;
  velocity: Vector;
}

const entities: Entity[] = [
  {
    mass: 1.989e30,
    position: [0, 0],
    velocity: [0, 0]
  },
  {
    mass: 0.33011e24,
    position: [57.909e9, 0],
    velocity: [0, 47.36e3]
  },
  {
    mass: 4.8675e24,
    position: [108.209e9, 0],
    velocity: [0, 35.02e3]
  },
  {
    mass: 5.9724e24,
    position: [149.596e9, 0],
    velocity: [0, 29.78e3]
  },
  {
    mass: 0.64171e24,
    position: [227.923e9, 0],
    velocity: [0, 24.07e3]
  },
  {
    mass: 1898.19e24,
    position: [778.570e9, 0],
    velocity: [0, 13e3]
  },
  {
    mass: 568.34e24,
    position: [1433.529e9, 0],
    velocity: [0, 9.68e3]
  },
  {
    mass: 86.813e24,
    position: [2872.463e9, 0],
    velocity: [0, 6.80e3]
  },
  {
    mass: 102.413e24,
    position: [4495.060e9, 0],
    velocity: [0, 5.43e3]
  }
];

function scaleVector(vector: Vector, scale: number): Vector {
  return [vector[0] * scale, vector[1] * scale]
}

function addVectors(...vectors: Vector[]): Vector {
  return vectors.reduce((acc, vector) => [acc[0] + vector[0], acc[1] + vector[1]])
}

let dt = 10000;
// now i just have to figure out why its NOT moving
function render() {

  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  
  // draw
  for (const entity of entities) {
    ctx.beginPath()
    const [x, y] = scaleVector(entity.position, 1e-9)
    ctx.arc(x + width / 2, y + height / 2, 10, 0, 2 * Math.PI)
    ctx.fill()
  }

  // update
  for (const entity of entities) {
    let a_g: Vector = [0, 0]
    for (const other of entities) {
      if (other !== entity) {
        const r_vector = addVectors(entity.position, scaleVector(other.position, -1))
        const r_mag = Math.sqrt(r_vector[0] ** 2 + r_vector[1] ** 2)
        const acceleration = -1.0 * 6.674e-11 * other.mass / r_mag ** 2
        const r_unit_vector = scaleVector(r_vector, 1 / r_mag)
        a_g = addVectors(a_g, scaleVector(r_unit_vector, acceleration))
      }
    }
    entity.velocity = addVectors(entity.velocity, scaleVector(a_g, dt))
  }

  for (const entity of entities) {
    entity.position = addVectors(entity.position, scaleVector(entity.velocity, dt))
  }

  requestAnimationFrame(render)
}

render()

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
});