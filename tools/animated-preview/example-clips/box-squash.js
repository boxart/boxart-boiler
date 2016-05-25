const sweep = t => Math.log(1 + t) / Math.log(2);
const xScale = t => Math.min(1 + sweep(t), 2 - sweep(t));
const yScale = t => Math.max(1 - sweep(t), sweep(t));

export default {
  metadata: {
    name: 'Box - Squash',
    duration: 1000,
  },
  box: {
    styles: {
      transform: [
        0, inputs => t => `translate3d(${inputs.offset * sweep(t)}px, 0, 0) scale(${xScale(t)}, ${yScale(t)})`,
      ],
      transformOrigin: [
        0, '50% 100% 0',
      ],
    },
  },
};
