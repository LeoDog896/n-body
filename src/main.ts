import './style.css'
import randomcolor from 'randomcolor'

const random = (min: number, max: number) => Math.random() * (max - min) + min

const canvas = document.querySelector('canvas')!

const ctx = canvas.getContext('2d')!

let width = canvas.width = window.innerWidth
let height = canvas.height = window.innerHeight

type Vector = [x: number, y: number];

type Entity = {
  mass: number;
  position: Vector;
  velocity: Vector;
  color: string;
}

let entities: Entity[] = Array.from({ length: 100 }, () => ({
  mass: 1e10,
  position: [random(-width / 2, width / 2), random(-height / 2, height / 2)],
  velocity: [0, 0],
  color: randomcolor()
}))

function scaleVector(vector: Vector, scale: number): Vector {
  return [vector[0] * scale, vector[1] * scale]
}

function addVectors(...vectors: Vector[]): Vector {
  return vectors.reduce((acc, vector) => [acc[0] + vector[0], acc[1] + vector[1]])
}

window.addEventListener('click', (event) => {
  const [x, y] = [event.clientX - width / 2, event.clientY - height / 2]
  entities.push({
    mass: 1e10,
    position: [x, y],
    velocity: [0, 0],
    color: randomcolor()
  })
})

let dt = 1;
function render() {

  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
  
  // draw
  for (const entity of entities) {
    ctx.beginPath()
    ctx.fillStyle = entity.color;
    const [x, y] = entity.position
    ctx.arc(x + width / 2, y + height / 2, 10, 0, 2 * Math.PI)
    ctx.fill()
  }

  // update
  for (const entity of entities) {
    let a_g: Vector = [0, 0]
    for (const other of entities) {
      if (other !== entity) {
        const softening_length = 0.01;

        const r_vector = addVectors(entity.position, scaleVector(other.position, -1));
        const r_mag = Math.sqrt(r_vector[0] ** 2 + r_vector[1] ** 2);

        let acceleration;
        if (r_mag > softening_length) {
          acceleration = -1.0 * 6.674e-11 * other.mass / (r_mag ** 2);
        } else {
          const softening_factor = (softening_length ** 2) / (r_mag * (r_mag + softening_length));
          acceleration = -1.0 * 6.674e-11 * other.mass * softening_factor;
        }

        const r_unit_vector = scaleVector(r_vector, 1 / r_mag);
        a_g = addVectors(a_g, scaleVector(r_unit_vector, acceleration));

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