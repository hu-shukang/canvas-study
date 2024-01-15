import { Circle, Layer, Rect, Stage } from 'react-konva';
import useWindow from '../hooks/window.hook';
import { useCallback, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { Portal } from 'react-konva-utils';

const Page4 = () => {
  const { width, height } = useWindow();

  const [isDragging, setDragging] = useState(false);

  const clickHandler = useCallback((evt: KonvaEventObject<MouseEvent>) => {
    console.log(evt.currentTarget.getAttr('name'));
  }, []);

  return (
    <Stage width={width} height={height}>
      <Layer name="layer2" onClick={clickHandler}>
        <Portal selector=".top-layer" enabled={isDragging}>
          <Rect
            name="rect"
            x={550}
            y={550}
            width={200}
            height={200}
            fill="red"
            draggable
            onDragStart={() => setDragging(true)}
            onDragEnd={() => setDragging(false)}
          />
        </Portal>
      </Layer>
      <Layer name="layer1" onClick={clickHandler}>
        <Circle name="circle" x={500} y={500} radius={100} fill="#0094ff" draggable />
      </Layer>
      <Layer name="top-layer" />
    </Stage>
  );
};

export default Page4;
