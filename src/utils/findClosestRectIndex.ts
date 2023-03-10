export type Direction = 'left' | 'right' | 'up' | 'down';
type Point = { x: number, y: number };

function findClosestRectIndex(rects: { index: number, rect: DOMRect }[], index: number, direction: Direction, loop?: boolean): number | undefined {
  if (index < 0) {
    return 0;
  }

  let adaptedRects = rects.map((node) => ({
    ...node,
    left: {
      x: node.rect.x,
      y: node.rect.y + node.rect.height / 2
    },
    up: {
      x: node.rect.x + node.rect.width / 2,
      y: node.rect.y,
    },
    right: {
      x: node.rect.x + node.rect.width,
      y: node.rect.y + node.rect.height / 2,
    },
    down: {
      x: node.rect.x + node.rect.width / 2,
      y: node.rect.y + node.rect.height,
    },
    index: node.index
  }));

  const targetIndex = adaptedRects.findIndex((node) => node.index === index);

  if (targetIndex === -1) return undefined; 

  const target = adaptedRects.splice(targetIndex, 1)[0];

  const distance = (a: Point, b: Point) => Math.sqrt(((b.x - a.x) ** 2) + (b.y - a.y) ** 2);

  const pointAxis: { [direction in Direction]: 'x' | 'y' } = {
    left: 'x',
    up: 'y',
    right: 'x',
    down: 'y',
  }
  const invertPoint: { [direction in Direction]: Direction } = {
    left: 'right',
    up: 'down',
    right: 'left',
    down: 'up'
  };

  const higherRects = adaptedRects.filter((rect) => {
    const axis = pointAxis[direction];
    let compare = (a: number, b: number) => a < b;

    if (direction === 'right' || direction === 'down') {
      compare = (a: number, b: number) => a > b;
    }

    return compare(rect[direction][axis], target[direction][axis]);
  })

  if (!higherRects.length && loop) {
    const lowerRects = adaptedRects.filter((rect) => {
      const axis = pointAxis[direction];
      let compare = (a: number, b: number) => a > b;
  
      if (direction === 'right' || direction === 'down') {
        compare = (a: number, b: number) => a < b;
      }

      let pointInAxis = false;

      if (axis === 'x') {
        if (target[direction].y >= rect.rect.y && target[direction].y <= rect.rect.y + rect.rect.height) {
          pointInAxis = true;
        }
      } else {
        if (target[direction].x >= rect.rect.x && target[direction].x <= rect.rect.x + rect.rect.width) {
          pointInAxis = true;
        }
      }
  
      return compare(rect[direction][axis], target[direction][axis]) && pointInAxis;
    })

    lowerRects.sort((a, b) => {
      return distance(target[direction], b[invertPoint[direction]]) - distance(target[direction], a[invertPoint[direction]]);
    })

    if (lowerRects[0]) {
      return lowerRects[0].index;
    }
  } else {
    higherRects.sort((a, b) => {
      return distance(target[direction], a[invertPoint[direction]]) - distance(target[direction], b[invertPoint[direction]]);
    })

    if (higherRects[0]) {
      return higherRects[0].index;
    }
  }
  return undefined;
}

export default findClosestRectIndex;