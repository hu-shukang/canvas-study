import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Layer, Rect, Text } from 'react-konva';
import { Portal, Html } from 'react-konva-utils';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/lib/Node';

type LabelProps = {
  id: string;
  selectedId: string;
};

const Label = ({ id, selectedId }: LabelProps) => {
  const [isDragging, setDragging] = useState(false);
  const selected = useMemo(() => id === selectedId, [id, selectedId]);
  const [edit, setEdit] = useState(false);
  const labelRef = useRef<Konva.Rect>(null!);
  const [text, setText] = useState('');
  const [labelProps, setLabelProps] = useState<Konva.RectConfig>({ x: 200, y: 200, width: 200, height: 200 });

  useEffect(() => {
    if (!selected) {
      setEdit(() => false);
    }
  }, [selected]);

  const dragEndHandler = useCallback((evt: KonvaEventObject<DragEvent>) => {
    setDragging(() => false);
    const { x, y } = evt.currentTarget.getAttrs();
    setLabelProps(prev => ({ ...prev, x: x, y: y }));
  }, []);

  return (
    <Layer>
      <Portal selector=".top-layer" enabled={isDragging}>
        <Group
          x={labelProps.x}
          y={labelProps.y}
          draggable
          onDragStart={() => setDragging(true)}
          onDragEnd={dragEndHandler}
          onDblClick={() => {
            setEdit(true);
            console.log('double click');
          }}
        >
          <Rect
            ref={labelRef}
            width={labelProps.width}
            height={labelProps.height}
            fill="#a9be26"
            stroke="red"
            strokeEnabled={selected}
            shadowColor="black"
            shadowBlur={10}
            shadowOpacity={0.6}
            shadowOffsetX={5}
            shadowOffsetY={5}
          ></Rect>
          {edit ? (
            <Html
              divProps={{
                style: {
                  position: 'absolute',
                  width: `${labelProps.width}px`,
                  height: `${labelProps.height}px`,
                },
              }}
            >
              <textarea
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '10px',
                  boxSizing: 'border-box',
                }}
                onChange={e => setText(e.target.value)}
                defaultValue={text}
              ></textarea>
            </Html>
          ) : (
            <Text id={id} text={text} padding={10} width={labelProps.width} height={labelProps.height} />
          )}
        </Group>
      </Portal>
    </Layer>
  );
};

export default Label;
