export default function propsAreEqual(keys: string[]) {
  return (prevProps, nextProps) => {
    return keys.every(key => JSON.stringify(prevProps[key]) === JSON.stringify(nextProps[key]));
  };
}
