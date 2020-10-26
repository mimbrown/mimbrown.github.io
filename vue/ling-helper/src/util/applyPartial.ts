export default function applyPartial<T, U extends Partial<T>>(target: T, source: U): T & U {
  return Object.assign({}, target, source);
}
