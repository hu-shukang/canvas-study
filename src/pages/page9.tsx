import { useCallback, useEffect, useRef } from 'react';
import useWindow from '../hooks/window.hook';
import Konva from 'konva';

type Point = {
  x: number;
  y: number;
};

type CircleConfig = {
  ref: Konva.Circle;
  originX: number;
  originY: number;
  isOffset: boolean;
  config: Konva.CircleConfig;
};

const Page9 = () => {
  const { width, height } = useWindow();
  const msg = '胡萝卜';
  // 定义飘散距离和速度
  const scatterDistance = 20;
  const animationSpeed = 0.3;

  const getImageData = useCallback((stage: Konva.Stage, msg: string) => {
    const layer = new Konva.Layer();
    stage.add(layer);
    const text = new Konva.Text({
      text: msg,
      fontFamily: 'Arial',
      fontSize: 300,
      align: 'center',
      verticalAlign: 'middle',
      x: width / 2,
      height: height / 2,
    });
    text.offsetX(text.width() / 2);
    text.offsetY(0 - text.height() / 2);
    layer.add(text);
    layer.draw();

    const ctx = layer.getNativeCanvasElement().getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, width, height);
    layer.remove();
    return imageData;
  }, []);

  useEffect(() => {
    const stage = new Konva.Stage({
      container: 'container',
      width: width,
      height: height,
    });

    const imageData = getImageData(stage, msg);

    const dotLayer = new Konva.Layer();
    stage.add(dotLayer);

    const circleList: Array<CircleConfig> = [];
    const scale = 4;
    for (let y = 0; y < imageData.height; y += scale) {
      for (let x = 0; x < imageData.width; x += scale) {
        const i = (y * imageData.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          const config: Konva.ContainerConfig = {
            x: x,
            y: y,
            radius: 1,
            fill: '#ffffff',
          };
          const circle = new Konva.Circle(config);
          dotLayer.add(circle);
          circleList.push({
            originX: x,
            originY: y,
            isOffset: false,
            ref: circle,
            config: config,
          });
        }
      }
    }

    stage.on('pointermove', ev => {
      ev.cancelBubble = true;
      const { clientX, clientY } = ev.evt;
      for (const circle of circleList) {
        const distanceToMouse = {
          x: clientX - circle.config.x!,
          y: clientY - circle.config.y!,
        };
        const distance = Math.sqrt(distanceToMouse.x * distanceToMouse.x + distanceToMouse.y * distanceToMouse.y);
        if (distance < 50 && !circle.isOffset) {
          // 如果鼠标在点附近
          const angle = Math.atan2(distanceToMouse.y, distanceToMouse.x);
          circle.ref.to({
            x: circle.originX + Math.cos(angle) * scatterDistance,
            y: circle.originY + Math.sin(angle) * scatterDistance,
            duration: animationSpeed,
            easing: Konva.Easings.EaseOut,
          });
          circle.isOffset = true;
        } else if (distance >= 50 && circle.isOffset) {
          circle.ref.to({
            x: circle.originX,
            y: circle.originY,
            duration: animationSpeed,
            easing: Konva.Easings.EaseOut,
          });
        }
      }
    });
    dotLayer.draw();
    () => {
      stage.remove();
    };
  }, [width, height]);

  return <div id="container" style={{ backgroundColor: '#343541' }}></div>;
};

export default Page9;
