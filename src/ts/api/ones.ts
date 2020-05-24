import { Shape, Value } from '../types';
import { fill } from './fill';

export default (shape: Shape): Value => {
    return fill(shape, 1);
}