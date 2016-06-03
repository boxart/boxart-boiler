export default {
  metadata: {
    name: 'Box - Rotate In',
    duration: 1000,
  },
  box: {
    styles: {
      transform: [
        0, (t, inputs) => `rotate(${-t * 360}deg) scale(${t})`,
      ],
    },
  },
};
