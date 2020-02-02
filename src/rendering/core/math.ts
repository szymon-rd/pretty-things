export const normal_random = () => {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export const randomNormalVector = (): number[] => {
  const x = normal_random();
  const y = normal_random();
  const z = normal_random();
  const l = Math.sqrt(x*x + y*y + z*z);
  return [x / l, y / l, z / l];
}

export const sphereToCartesian = (phi:  number, theta: number) => {
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  return [x,y,z];
}
