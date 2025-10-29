export class Utils {
  static roundToDecimal(number: number, decimalPlaces: number): number {
    return Number(number.toFixed(decimalPlaces));
  }

  static getMonthYearFromDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${ year }-${ month < 10 ? "0" + month : month }`;
  }
}
