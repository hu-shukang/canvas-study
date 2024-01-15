import { Circle, Layer, Stage } from 'react-konva';
import useWindow from '../hooks/window.hook';
import Konva from 'konva';
import { RefObject, createRef, useCallback, useEffect, useState } from 'react';
import { stringUtil } from '../utils/string.util';
import { colorUtil } from '../utils/color.util';
import { numberUtil } from '../utils/number.util';
import { KonvaEventObject } from 'konva/lib/Node';

type CircleConfig = Konva.CircleConfig & {
  animation: boolean;
  ref: RefObject<Konva.Circle>;
};

const Page3 = () => {
  const offset = 200;
  const { width, height } = useWindow();
  const [circles, setCircles] = useState<CircleConfig[]>([]);

  const generateCircleConfig = useCallback((x: number, y: number): CircleConfig => {
    const circle: CircleConfig = {
      id: stringUtil.id(),
      x: x,
      y: y,
      radius: numberUtil.random(30, 50),
      stroke: colorUtil.random(),
      animation: false,
      ref: createRef<Konva.Circle>(),
    };
    return circle;
  }, []);

  useEffect(() => {
    circles.forEach(circle => {
      const current = circle.ref.current;
      if (circle.animation || !current) {
        return;
      }
      const animation = new Konva.Tween({
        node: current,
        duration: 3,
        x: current.getAttr('x') + numberUtil.random(0 - offset, offset),
        y: current.getAttr('y') + numberUtil.random(0 - offset, offset),
        opacity: 0,
        radius: 0,
        onFinish: () => {
          setCircles(prev => prev.filter(c => c.id !== circle.id));
        },
      });
      circle.animation = true;
      animation.play();
    });
  }, [circles]);

  const mouseMoveHandler = useCallback(({ evt }: KonvaEventObject<MouseEvent>) => {
    requestAnimationFrame(() => {
      setCircles(prev => [...prev, generateCircleConfig(evt.clientX, evt.clientY)]);
    });
  }, []);

  return (
    <Stage width={width} height={height} onMouseMove={mouseMoveHandler}>
      <Layer>
        {circles.map(config => (
          <Circle key={config.id} {...config}></Circle>
        ))}
      </Layer>
    </Stage>
  );
};

export default Page3;
