export function convertWattsToKVA(watts: number, pf: number = 1): number {
  return watts / (1000 * pf);
}

export function convertKVAToWatts(kva: number, pf: number = 1): number {
  return kva * 1000 * pf;
}

export function formatKVA(watts: number, pf: number = 1): string {
  return convertWattsToKVA(watts, pf).toFixed(2);
}
