export type Direction = 'left' | 'right' | 'up' | 'down'
type Point = { x: number; y: number }

const pointAxis: { [direction in Direction]: 'x' | 'y' } = {
  left: 'x',
  up: 'y',
  right: 'x',
  down: 'y'
}

export const invertPoint: { [direction in Direction]: Direction } = {
  left: 'right',
  up: 'down',
  right: 'left',
  down: 'up'
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

function findClosestRectIndex(
  rects: { index: number; rect: Rect }[],
  index: number,
  direction: Direction,
  loop?: boolean,
  selectionFrom?: Direction,
): number | undefined {
  let adaptedRects = rects.map((node) => ({
    ...node,
    left: {
      x: node.rect.x,
      y: node.rect.y + node.rect.height / 2
    },
    up: {
      x: node.rect.x + node.rect.width / 2,
      y: node.rect.y
    },
    right: {
      x: node.rect.x + node.rect.width,
      y: node.rect.y + node.rect.height / 2
    },
    down: {
      x: node.rect.x + node.rect.width / 2,
      y: node.rect.y + node.rect.height
    },
    index: node.index
  }));

  const firstRect = () => {
    return rects.sort((a, b) => a.index - b.index)[0]?.index;
  }

  if (index < 0) {
    if (!selectionFrom) {
      return firstRect();
    }

    const compare = (a: number, b: number) => ['up', 'left'].includes(selectionFrom) ? a - b : b - a;

    return adaptedRects.sort((a, b) => compare(a[selectionFrom][pointAxis[selectionFrom]], b[selectionFrom][pointAxis[selectionFrom]]))[0]?.index; 
  }

  const targetIndex = adaptedRects.findIndex((node) => node.index === index);

  if (targetIndex === -1) return firstRect();

  const target = adaptedRects.splice(targetIndex, 1)[0];

  const distance = (a: Point, b: Point) =>
    Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);

  const compare = (a: number, b: number) => ['up', 'left'].includes(direction) ? a < b : a > b;

  const higherRects = adaptedRects.filter((rect) => {
    const axis = pointAxis[direction];

    return compare(rect[direction][axis], target[direction][axis]);
  })

  if (!higherRects.length && loop) {
    const lowerRects = adaptedRects.filter((rect) => {
      const axis = pointAxis[direction];

      const compare = (a: number, b: number) => ['up', 'left'].includes(direction) ? a > b : a < b;

      let pointInAxis = false;

      if (axis === 'x') {
        if (
          target[direction].y >= rect.rect.y &&
          target[direction].y <= rect.rect.y + rect.rect.height
        ) {
          pointInAxis = true;
        }
      } else {
        if (
          target[direction].x >= rect.rect.x &&
          target[direction].x <= rect.rect.x + rect.rect.width
        ) {
          pointInAxis = true;
        }
      }

      return (
        compare(rect[direction][axis], target[direction][axis]) && pointInAxis
      );
    })

    lowerRects.sort((a, b) => {
      return (
        distance(target[direction], b[invertPoint[direction]]) -
        distance(target[direction], a[invertPoint[direction]])
      )
    });

    return lowerRects[0]?.index;
  } else {
    higherRects.sort((a, b) => {
      return (
        distance(target[direction], a[invertPoint[direction]]) -
        distance(target[direction], b[invertPoint[direction]])
      )
    });

    return higherRects[0]?.index;
  }
}

export default findClosestRectIndex
