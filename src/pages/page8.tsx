import { useEffect, useRef } from 'react';
import useWindow from '../hooks/window.hook';

type MovingStatus = 'MOVING' | 'MOVED' | 'STATIC';

type Point = {
  x: number;
  y: number;
};

class Circle {
  public static CURRENT_TIME = 0;
  private _originX: number;
  private _originY: number;
  private _x: number;
  private _y: number;
  private _toX: number;
  private _toY: number;
  private _color: string = '#ffffff';
  private _movingStatus: MovingStatus;
  private _startTime: number = 0;

  constructor(x: number, y: number) {
    this._originX = x;
    this._originY = y;
    this._x = x;
    this._y = y;
    this._toX = x;
    this._toY = y;
    this._movingStatus = 'STATIC';
  }

  update(time: number) {
    if (this._movingStatus === 'MOVING') {
      const t = time - this._startTime;
      const speed = t / 2000 > 1 ? 1 : t / 2000;
      this._x = speed * (this._toX - this._x) + this._x;
      this._y = speed * (this._toY - this._y) + this._y;
      if (speed === 1) {
        this._movingStatus = 'MOVED';
        this._startTime = 0;
      }
    }
  }

  move(mouseX: number, mouseY: number) {
    if (this._movingStatus === 'MOVING') {
      return;
    }
    const dx = mouseX - this._originX;
    const dy = mouseY - this._originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 10) {
      const { x, y } = this.forwardPoint({ x: mouseX, y: mouseY }, { x: this._x, y: this._y }, 10);
      this._toX = x;
      this._toY = y;
      this._movingStatus = 'MOVING';
      this._startTime = Circle.CURRENT_TIME;
    } else {
      if (this._movingStatus === 'MOVED') {
        this._toX = this._originX;
        this._toY = this._originY;
        this._movingStatus = 'MOVING';
        this._startTime = Circle.CURRENT_TIME;
      }
    }
  }

  private forwardPoint(mousePoint: Point, circlePoint: Point, distance: number) {
    // 计算方向向量 (mousePoint -> circlePoint)
    const directionVector = { x: circlePoint.x - mousePoint.x, y: circlePoint.y - mousePoint.y };
    // 计算向量长度
    const length = Math.sqrt(directionVector.x * directionVector.x + directionVector.y * directionVector.y);
    // 标准化向量 (使其长度为 1)
    const normalizedVector = { x: directionVector.x / length, y: directionVector.y / length };
    // 将标准化向量乘以距离
    const moveVector = { x: normalizedVector.x * distance, y: normalizedVector.y * distance };

    return {
      x: circlePoint.x + moveVector.x,
      y: circlePoint.y + moveVector.y,
    };
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get color() {
    return this._color;
  }
}

const Page8 = () => {
  const { width, height } = useWindow();
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const animationFrameId = useRef<number>();
  const circleList = useRef<Circle[]>([]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);
    ctx.font = '300px Arial';
    const text = '胡萝卜';
    const textWidth = ctx.measureText(text).width;
    const x = (width - textWidth) / 2;
    const y = height / 2; // 这里可以根据需要调整y坐标

    // 绘制文字
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x, y);

    const imageData = ctx.getImageData(0, 0, width, height);
    const list: Array<Circle> = [];
    const scale = 4; // 控制点的间距
    for (let y = 0; y < imageData.height; y += scale) {
      for (let x = 0; x < imageData.width; x += scale) {
        const i = (y * imageData.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          // 仅选取透明度大于128的像素
          list.push(new Circle(x, y));
        }
      }
    }
    const drawAll = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      Circle.CURRENT_TIME = time;
      console.log(time);
      for (const circle of list) {
        ctx.beginPath();
        circle.update(time);
        ctx.arc(circle.x, circle.y, 1, 0, Math.PI);
        ctx.fillStyle = circle.color;
        ctx.fill();
      }
    };

    const animate = (time: number) => {
      drawAll(time);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    // 开始动画
    animationFrameId.current = requestAnimationFrame(animate);
    circleList.current = list;

    // 清理函数
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // 鼠标移动事件处理
  const handleMouseMove = (event: any) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    for (const circle of circleList.current) {
      circle.move(mouseX, mouseY);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      onMouseMove={handleMouseMove}
      style={{ backgroundColor: '#343541' }}
    ></canvas>
  );
};

export default Page8;
