import { Shape, VectorOrMatrix } from '../types';
import { fill } from './fill';

export default (shape: Shape): VectorOrMatrix => {
    return fill(shape, 0);
}