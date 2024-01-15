import { Layer, Stage } from 'react-konva';
import Label from '../components/label.component';
import useWindow from '../hooks/window.hook';
import { useCallback, useState } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';

const Page5 = () => {
  const { width, height } = useWindow();
  const [selectedItemId, setSelectedItemId] = useState('');

  const clickHandler = useCallback((evt: KonvaEventObject<MouseEvent>) => {
    evt.cancelBubble = true;
    console.log(evt.target);
    setSelectedItemId(() => evt.target.getAttr('id'));
  }, []);

  return (
    <Stage id="global" width={width} height={height} onClick={clickHandler}>
      <Label id="label01" selectedId={selectedItemId} />
      <Layer name="top-layer" />
    </Stage>
  );
};

export default Page5;
