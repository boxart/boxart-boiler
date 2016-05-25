export default {
  metadata: {
    name: 'Box - Rotate In Drop',
    duration: 2000,
  },
  box: {
    styles: {
      transform: [
        0, (t, inputs) => `rotate(${-t * 360}deg) scale(${t})`,
        972, (t, inputs) => `rotate(${-t * 10}deg)`,
        1000, (t, inputs) => `rotate(-10deg)`,
        1500, (t, inputs) => `rotate(${-10 * (1 - t * t)}deg)`,
      ],
      transformOrigin: [
        0, '50% 50% 0',
        972, '50% 50% 0',
        972, '0% 100% 0',
      ],
    },
  },
};
