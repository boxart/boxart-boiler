export default {
  metadata: {
    name: 'Box - Slide Out',
    duration: 1000,
  },
  box: {
    styles: {
      transform: [
        0, inputs => t => `translate3d(${inputs.offset * (t * t)}px, 0, 0) scale(${1 - t})`,
      ],
      opacity: [
        0, 1,
        1000, 0,
      ],
    },
  },
};
