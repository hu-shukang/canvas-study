import Konva from 'konva';
import { Circle, Group, Layer, Line, Stage } from 'react-konva';
import useWindow from '../hooks/window.hook';
import { useCallback, useEffect, useRef, useState } from 'react';
import { numberUtil } from '../utils/number.util';
import { stringUtil } from '../utils/string.util';
import { colorUtil } from '../utils/color.util';

type Point = {
  distance: number;
  angle: number;
  shape: Konva.CircleConfig;
  tail: Array<{ x: number; y: number }>;
  tailColors: Array<string | number>;
};

const Page7 = () => {
  const tailLength = 250;
  const animation = useRef<Konva.Animation | null>(null);
  const { width, height, visibilityState } = useWindow();
  const layerRef = useRef<Konva.Layer>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const colors = ['#a9be26', '#25cee9', '#ffffff'];

  const getTailColors = useCallback((color: string) => {
    const tailColors: (string | number)[] = [];
    for (let i = 0; i < tailLength; i++) {
      const opacity = 1 - i / tailLength;
      tailColors.push(opacity); // 颜色停靠点位置
      tailColors.push(colorUtil.hexToRGBA(color, opacity)); // 颜色
    }
    return tailColors;
  }, []);

  const generatePoint = useCallback((): Point => {
    const padding = 10;
    const max = Math.max(width, height);
    const distance = numberUtil.random(300, max - padding) / 2;
    const angle = numberUtil.randomFloat(0, Math.PI * 2);
    const color = colors[numberUtil.random(0, colors.length - 1)];
    const shape: Konva.CircleConfig = {
      id: stringUtil.id(),
      x: width / 2 + distance * Math.cos(angle),
      y: height / 2 + distance * Math.sin(angle),
      radius: 2,
      fill: color,
      shadowColor: '#ffffff',
      shadowBlur: 10,
      shadowOpacity: 0.5,
    };
    return {
      distance,
      angle,
      shape,
      tail: [],
      tailColors: getTailColors(color),
    };
  }, [width, height]);

  const createAnimation = useCallback(
    (points: Point[]) => {
      const animation = new Konva.Animation(frame => {
        if (!frame) return;
        const angleSpeed = frame.time > 4000 ? 0.0001 : 0.00005;
        const angleChange = angleSpeed * frame.timeDiff;
        const newPoints = [...points];
        newPoints.forEach(point => {
          point.angle += angleChange;
          if (point.angle > Math.PI * 2) {
            point.angle -= Math.PI * 2;
          }
          const newX = width / 2 + point.distance * Math.cos(point.angle);
          const newY = height / 2 + point.distance * Math.sin(point.angle);
          point.shape.x = newX;
          point.shape.y = newY;

          if (frame.time > 4000) {
            // 更新尾巴位置
            point.tail.push({ x: newX, y: newY });
            if (point.tail.length > tailLength) {
              point.tail.shift();
            }
          }
        });
        setPoints(() => newPoints);
      }, layerRef.current);
      return animation;
    },
    [points, width, height],
  );

  useEffect(() => {
    const points = Array(200)
      .fill(null)
      .map(_ => generatePoint());
    animation.current = createAnimation(points);
    animation.current.start();

    return () => {
      animation.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (visibilityState) {
      animation.current?.start();
    } else {
      animation.current?.stop();
    }
  }, [visibilityState]);

  return (
    <Stage width={width} height={height} style={{ backgroundColor: '#343541' }}>
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

export default Page7;
