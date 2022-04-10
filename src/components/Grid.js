import { Line } from 'react-konva';

const Grid = ({blocksize, scale}) => {
  const verticals = []
  const horizontals = []

  for (var i = 0; i < window.innerWidth / blocksize * scale; i++) {
    verticals.push(
      <Line
        key={`vertical${i}`}
        points={[Math.round(i * blocksize * scale) + 0.5, 0, Math.round(i * blocksize * scale) + 0.5, window.innerHeight]}
        stroke='#ddd'
        opacity={0.2}
        strokeWidth={1}
      />
    )
  }

  for (var j = 0; j < window.innerHeight / blocksize * scale; j++) {
    horizontals.push(
      <Line
        key={`horizontal${i}`}
        points={[0, Math.round(j * blocksize * scale), window.innerWidth, Math.round(j * blocksize * scale)]}
        stroke='#ddd'
        strokeWidth={0.5}
        opacity={0.2}
      />
    )
  }

  return <>{horizontals}{verticals}</>

}

export default Grid
