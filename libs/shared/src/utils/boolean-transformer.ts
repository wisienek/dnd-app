import { Transform } from 'class-transformer';

export function TransformBoolean() {
  return Transform(({ value }) => {
    if (value === true || value === 'true' || value === 1 || value === '1')
      return true;
    if (value === false || value === 'false' || value === 0 || value === '0')
      return false;

    return undefined;
  });
}
