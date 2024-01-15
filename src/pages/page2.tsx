import { Circle, Layer, Stage } from 'react-konva';
import Konva from 'konva';
import { useEffect, useRef } from 'react';
import { numberUtil } from '../utils/number.util';
import useWindow from '../hooks/window.hook';

const initCircleDataList = (): Konva.CircleConfig[] => {
  const list: Konva.CircleConfig[] = [];
  const center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  const colors = ['#75d8a0', '#0094ff', '#d84a33'];
  for (let i = 0; i < 10; i++) {
    list.push({
      id: i.toString(),
      x: center.x,
      y: center.y,
      radius: 100,
      stroke: colors[i % colors.length],
    });
  }
  return list;
};

const Page2 = () => {
  const { width, height } = useWindow();
  const circleRefs = useRef<Konva.Circle[]>([]);
  const circleConfigs = initCircleDataList();

  useEffect(() => {
    circleRefs.current.forEach(circle => {
      const tween = new Konva.Tween({
        node: circle,
        duration: 1,
        x: circle.getAttr('x') + numberUtil.random(-100, 100),
        y: circle.getAttr('y') + numberUtil.random(-100, 100),
        opacity: 0,
        radius: 0,
      });
      circle.setAttr('animation', tween);
      tween.play();
    });
  }, []);

  return (
    <Stage width={width} height={height}>
      <Layer>
        {circleConfigs.map((config, idx) => (
          <Circle key={config.id} {...config} ref={node => (circleRefs.current[idx] = node!)} />
        ))}
      </Layer>
    </Stage>
  );
};

export default Page2;
