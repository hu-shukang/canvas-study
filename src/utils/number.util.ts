class NumberUtil {
  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public randomFloat(min: number, max: number) {
    return Math.random() * (max - min + 1) + min;
  }
}

export const numberUtil = new NumberUtil();
