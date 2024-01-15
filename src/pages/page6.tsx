import { Circle, Group, Layer, Line, Stage } from 'react-konva';
import useWindow from '../hooks/window.hook';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleConfig } from 'konva/lib/shapes/Circle';
import { stringUtil } from '../utils/string.util';
import Konva from 'konva';

type Point = {
  radius: number;
  angle: number;
  shape: CircleConfig;
  tail: Array<{ x: number; y: number }>; // 新增尾巴的位置数组
  tailColors: (string | number)[]; // 新增尾巴颜色数组
};

const Page6 = () => {
  const tailLength = 300;
  const animation = useRef<Konva.Animation | null>(null);
  const { width, height } = useWindow();
  const layerRef = useRef<Konva.Layer>(null);
  const [points, setPoints] = useState<Point[]>([]);

  const generatePoint = useCallback((): Point => {
    const radius = 100;
    const angle = 0;
    const shape: CircleConfig = {
      id: stringUtil.id(),
      x: width / 2 + radius * Math.cos(angle),
      y: height / 2 + radius * Math.sin(angle),
      radius: 2,
      fill: '#ffffff',
    };
    const tailColors = [];
    for (let i = 0; i < tailLength; i++) {
      const opacity = 1 - i / tailLength;
      tailColors.push(opacity); // 颜色停靠点位置
      tailColors.push(`rgba(255, 255, 255, ${opacity})`); // 颜色
    }
    return { radius, angle, shape, tail: [], tailColors };
  }, [width, height]);

  useEffect(() => {
    const point = generatePoint();
    setPoints(() => [point]);

    console.log(`point: ${point}`);
  }, []);

  useEffect(() => {
    if (points.length !== 0) {
      animation.current = new Konva.Animation(frame => {
        if (!frame) {
          return;
        }
        const angleSpeed = 0.001;
        const angleChange = angleSpeed * frame.timeDiff;
        const newPoint = [...points];
        newPoint.forEach(point => {
          point.angle += angleChange;
          if (point.angle > Math.PI * 2) {
            point.angle -= Math.PI * 2;
          }
          const newX = width / 2 + point.radius * Math.cos(point.angle);
          const newY = height / 2 + point.radius * Math.sin(point.angle);
          point.shape.x = newX;
          point.shape.y = newY;

          // 更新尾巴位置
          point.tail.push({ x: newX, y: newY });
          if (point.tail.length > tailLength) {
            // 限制尾巴长度
            point.tail.shift();
          }
        });
        setPoints(() => newPoint);
      }, layerRef.current);

      animation.current.start();

      return () => {
        if (animation.current) {
          animation.current.stop();
        }
      };
    }
  }, [points]);

  return (
    <Stage width={width} height={height} style={{ backgroundColor: 'black' }}>
      <Layer ref={layerRef}>
        {points.map(({ shape, tail, tailColors }) => (
          <Group key={shape.id}>
            <Circle {...shape} />
            {tail.length > 0 ? (
              <Line
                points={tail.flatMap(p => [p.x, p.y])}
                strokeLinearGradientStartPoint={{ x: tail[0].x, y: tail[0].y }}
                strokeLinearGradientEndPoint={{ x: tail[tail.length - 1].x, y: tail[tail.length - 1].y }}
                strokeLinearGradientColorStops={tailColors}
                strokeWidth={shape.radius}
              />
            ) : null}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
};

export default Page6;
