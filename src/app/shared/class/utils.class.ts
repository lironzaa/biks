export class Utils {
  static roundToDecimal(number: number, decimalPlaces: number): number {
    return Number(number.toFixed(decimalPlaces));
  }
}
