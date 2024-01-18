import { useEffect, useRef } from 'react';
import useWindow from '../hooks/window.hook';

class Circle {
  // 添加速度和目标位置属性
  private _originX: number;
  private _originY: number;
  private _x: number;
  private _y: number;
  private _color: string = '#ffffff';

  constructor(x: number, y: number) {
    this._originX = x;
    this._originY = y;
    this._x = x;
    this._y = y;
  }

  // 方法来更新圆点位置
  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this._originX;
    const dy = mouseY - this._originY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 40) {
      const angle = Math.atan2(dy, dx);
      const targetX = mouseX + Math.cos(angle) * 40; // 20是飘散的距离
      const targetY = mouseY + Math.sin(angle) * 40;
      this._x = targetX;
      this._y = targetY;
    } else {
      this._x = this._originX;
      this._y = this._originY;
    }
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
    const drawAll = () => {
      ctx.clearRect(0, 0, width, height);
      for (const circle of list) {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, 1, 0, Math.PI);
        ctx.fillStyle = circle.color;
        ctx.fill();
      }
    };

    const animate = () => {
      drawAll();
      animationFrameId.current = requestAnimationFrame(animate);
    };
    // 开始动画
    animate();
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
      circle.update(mouseX, mouseY);
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
