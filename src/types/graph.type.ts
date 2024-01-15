export class CircleG {
  private _radius: number = 40;
  private _prev: number = 0;
  private _life: number = 40000; // ms
  private _rs: number;

  constructor(
    private _x: number,
    private _y: number,
    private _xs: number,
    private _ys: number,
    private _color: string,
  ) {
    this._rs = this._radius / (this._life / 1000);
  }

  public move(timestamp: number) {
    // console.log(timestamp);
    if (timestamp >= this._life) {
      return undefined;
    }
    const time = timestamp - this._prev;
    this._x = (time / 1000) * this._xs;
    this._y = (time / 1000) * this._ys;
    // this._radius = this._radius - (time / 1000) * this._rs;
    return this;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get radius() {
    return this._radius;
  }

  get color() {
    return this._color;
  }
}
