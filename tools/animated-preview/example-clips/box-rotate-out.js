const pow2 = t => t * t;
const invRotateHeight = t => Math.cos(Math.abs((t * Math.PI * 2 + Math.PI / 4) % (Math.PI / 2) - Math.PI / 4));

export default {
  metadata: {
    name: 'Box - Rotate Out',
    duration: 3000,
  },
  box: {
    styles: {
      transform: [
        0, inputs => t => (
          `translate(${inputs.offset * pow2(t)}px, 0)` +
          `rotate(${t * 360}deg) scale(${invRotateHeight(t)})`
        ),
      ],
    },
  },
};
