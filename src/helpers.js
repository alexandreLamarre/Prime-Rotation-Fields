import SquareMatrix from "./SquareMatrix";

export function generatePrimes(num){
  const bool_array = [];
  for(let i = 0; i < num; i++){
    bool_array.push(true);
  }

  for(let i = 2; i < num; i++){
    if(bool_array[i-1] === true){
      for(let j = Math.pow(i,2); j < num; j+= i){
        bool_array[j-1] = false;
      }
    }
  }
  const primes = [];
  for(let i = 0; i < bool_array.length; i++){
    if(bool_array[i] === true && i !== bool_array.length-1) primes.push(i+1);
  }
  return primes;
}


export function rotateLineSegment(radians, start, end){
  const ROTATIONMATRIX = new SquareMatrix([[Math.cos(radians), -Math.sin(radians)],
      [Math.sin(radians), Math.cos(radians)]]);
  const diff = [end[0] - start[0], end[1]-start[1]]
  const r_vector = ROTATIONMATRIX.rMultiply(diff);
  r_vector[0]+= start[0];
  r_vector[1]+= start[1];
  return r_vector;
}
