import { Circle, Layer, Stage } from 'react-konva';
import useWindow from '../hooks/window.hook';
import { useEffect, useRef } from 'react';
import Konva from 'konva';

const Page1 = () => {
  const { width, height } = useWindow();
  const circleRef = useRef<Konva.Circle>(null!);
  useEffect(() => {
    const tween = new Konva.Tween({
      node: circleRef.current,
      duration: 3,
      easing: Konva.Easings.EaseInOut,
      onUpdate: () => console.log('node attrs updated'),
      onFinish: () => console.log('finished'),
      x: 800,
      fill: 'red',
    });
    tween.play();

    return () => {
      tween.destroy();
    };
  }, []);

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Circle ref={circleRef} x={200} y={500} radius={100} stroke={'#0094ff'} />
      </Layer>
    </Stage>
  );
};

export default Page1;
