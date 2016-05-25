const sin2T = t => Math.sin(t * Math.PI * 4);

export default {
  metadata: {
    name: 'Box - Shake 2',
    duration: 1000,
  },
  box: {
    styles: {
      transform: [
        0, (t, inputs) => `rotateZ(${sin2T(t) * Math.PI / 6}rad)`,
      ],
      transformOrigin: [
        0, '50% 80% 0',
      ],
    },
  },
};
