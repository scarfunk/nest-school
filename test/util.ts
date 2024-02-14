export function sleep(number: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, number);
  });
}
