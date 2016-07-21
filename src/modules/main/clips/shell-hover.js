const sinT = t => Math.sin(t * Math.PI * 2);

export default {
  metadata: {
    name: 'Shell - Hover',
    duration: 1000,
  },
  box: {
    styles: {
      transform: [
        0, (t, inputs) => `rotate3d(0, 0, 1, ${sinT(t) * Math.PI / 18}rad)`,
      ],
      transformOrigin: [
        0, '50% 80% 0',
      ],
    },
  },
};
