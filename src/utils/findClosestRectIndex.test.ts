import findClosestRectIndex from './findClosestRectIndex'

describe('findClosestRectIndex', () => {
  it('is truthy', () => {
    expect(findClosestRectIndex).toBeTruthy()
  })

  it('returns undefined when no params', () => {
    expect(findClosestRectIndex([], 0, 'up')).toBeUndefined()
  })

  it('returns 0 when one index', () => {
    expect(
      findClosestRectIndex(
        [{ index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } }],
        -1,
        'down'
      )
    ).toBe(0)
  })

  it('returns undefined when getting out of array', () => {
    expect(
      findClosestRectIndex(
        [{ index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } }],
        0,
        'down'
      )
    ).toBeUndefined()
  })

  it('returns itself when getting out of looping array', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 100, width: 100, height: 100 } },
        ],
        1,
        'down',
        true
      )
    ).toBe(0)
  })

  it('returns the first index when one index', () => {
    expect(
      findClosestRectIndex(
        [{ index: 10, rect: { x: 0, y: 0, width: 100, height: 100 } }],
        -1,
        'down'
      )
    ).toBe(10)
  })

  it('returns the closest stick to the bottom', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 100, width: 100, height: 100 } },
        ],
        0,
        'down'
      )
    ).toBe(1)
  })

  it('returns the closest no overlap to the bottom', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 200, width: 100, height: 100 } },
        ],
        0,
        'down'
      )
    ).toBe(1)
  })

  it('returns the closest overlap to the bottom', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 50, width: 100, height: 100 } },
        ],
        0,
        'down'
      )
    ).toBe(1)
  })

  it('returns the closest stick to the right', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 100, y: 0, width: 100, height: 100 } },
        ],
        0,
        'right'
      )
    ).toBe(1)
  })

  it('returns the closest no overlap to the right', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 200, y: 0, width: 100, height: 100 } },
        ],
        0,
        'right'
      )
    ).toBe(1)
  })

  it('returns the closest overlap to the right', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 50, y: 0, width: 100, height: 100 } },
        ],
        0,
        'right'
      )
    ).toBe(1)
  })

  it('returns the closest stick to the top', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 100, width: 100, height: 100 } },
        ],
        1,
        'up'
      )
    ).toBe(0)
  })

  it('returns the closest no overlap to the top', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 200, width: 100, height: 100 } },
        ],
        1,
        'up'
      )
    ).toBe(0)
  })

  it('returns the closest overlap to the top', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 0, y: 50, width: 100, height: 100 } },
        ],
        1,
        'up'
      )
    ).toBe(0)
  })

  it('returns the closest stick to the left', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 100, y: 0, width: 100, height: 100 } },
        ],
        1,
        'left'
      )
    ).toBe(0)
  })

  it('returns the closest no overlap to the left', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 200, y: 0, width: 100, height: 100 } },
        ],
        1,
        'left'
      )
    ).toBe(0)
  })

  it('returns the closest overlap to the left', () => {
    expect(
      findClosestRectIndex(
        [
          { index: 0, rect: { x: 0, y: 0, width: 100, height: 100 } },
          { index: 1, rect: { x: 50, y: 0, width: 100, height: 100 } },
        ],
        1,
        'left'
      )
    ).toBe(0)
  })
})
