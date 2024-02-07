const { NEW_FOCUS, newFocus } = require('../src/solver');

describe('focus Merge order', () => {
  const guard = {
    dataset: {
      focusGuard: true,
    },
  };

  it('handle zero values', () => {
    // cycle via left
    expect(newFocus([], [], [], undefined, 0)).toBe(NEW_FOCUS);
  });

  it('should move from start to end', () => {
    // cycle via left
    expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, 5], 1, 2)).toBe(2);
  });

  it('should move from end to start', () => {
    // cycle via right
    expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, 5], 5, 4)).toBe(0);
  });

  it('should keep direction of move', () => {
    // cycle via left
    expect(newFocus([2, 4, 6], [2, 4, 6], [1, 2, 3, 4, 5, 6], 5, 4)).toBe(2);
  });

  it('should jump back', () => {
    // jump back
    expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, 5], 1, 4)).toBe(2);
    // jump back
    expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, 5], 1, 3)).toBe(1);
  });

  describe('if land on guard', () => {
    it('(back) 4 -> 0 -> 4', () => {
      // jump to the last
      expect(newFocus([2, 3, 4], [2, 3, 4], [guard, 2, 3, 4, 5], guard, 4)).toBe(2);
    });

    it('(back) 3 -> 0 -> 4', () => {
      // jump to the last
      expect(newFocus([2, 3, 4], [2, 3, 4], [guard, 2, 3, 4, 5], guard, 3)).toBe(2);
    });

    it('(forward) 3 -> 5 -> 1', () => {
      // jump to the last
      expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, guard], guard, 4)).toBe(0);
    });

    it('(forward) 4 -> 5 -> 1', () => {
      // jump to the last
      expect(newFocus([2, 3, 4], [2, 3, 4], [2, 2, 3, 4, guard], guard, 3)).toBe(0);
    });
  });

  describe('radios', () => {
    const radio = {
      tagName: 'INPUT',
      type: 'radio',
      name: 'x',
    };
    const radio1 = Object.assign({}, radio);
    const radio2 = Object.assign({}, radio);
    const radioChecked = Object.assign({ checked: true }, radio);

    it('picks active radio to left', () => {
      const innerNodes = [radio1, radioChecked, 4];
      expect(newFocus(innerNodes, innerNodes, [1, ...innerNodes, 5], 5, 4)).toBe(1);
    });

    it('picks active radio to right', () => {
      const innerNodes = [1, radio1, radioChecked, radio2];
      expect(newFocus(innerNodes, innerNodes, [0, ...innerNodes, 5], 0, 1)).toBe(2);
    });

    it('jump out via last node', () => {
      const innerNodes = [1, radioChecked];
      expect(newFocus(innerNodes, innerNodes, [0, ...innerNodes, 5], 5, radioChecked)).toBe(0);
    });

    it('jump out via unchecked node', () => {
      // radio1 and radio2 should be invisible to algo
      const innerNodes = [1, radioChecked, radio1, radio2];
      expect(newFocus(innerNodes, innerNodes, [0, ...innerNodes, 5], 5, radioChecked)).toBe(0);
    });
  });

  it('should select auto focused', () => {
    expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, 5], 1, 0)).toBe(NEW_FOCUS);
  });

  it('should restore last tabbable', () => {
    expect(newFocus([2, 3, 4], [2, 3, 4], [1, 2, 3, 4, 5], 1, 3)).toBe(1);
  });

  it('should restore last focusable', () => {
    expect(newFocus([2, 3, 4], [2, 4], [1, 2, 3, 4, 5], 1, 3)).toBe(1);
  });
});
