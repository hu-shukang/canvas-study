class ColorUtil {
  private seed = [
    '#1b092a',
    '#a9be26',
    '#25cee9',
    '#7e279f',
    '#a81eb0',
    '#d6e7d0',
    '#d6c6cb',
    '#779d76',
    '#4c3a7a',
    '#2df7db',
  ];

  public random() {
    const min = 0;
    const max = this.seed.length - 1;
    const idx = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.seed[idx];
  }

  public hexToRGBA(hex: string, opacity: number) {
    // 如果是短格式的颜色代码 (#RGB)，将其转换为完整格式 (#RRGGBB)
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    // 从16进制颜色值中提取RGB值
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // 返回最终的RGBA颜色字符串
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
}

export const colorUtil = new ColorUtil();
