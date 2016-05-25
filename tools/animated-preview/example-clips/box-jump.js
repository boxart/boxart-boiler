const sinHalfT = t => Math.sin(t * Math.PI);
const sinQuarterT = t => Math.sin(t * Math.PI / 2);
const launchT = t => -(t - 1) * (t - 1) + 1;

export default {
  metadata: {
    name: 'Box - Jump',
    duration: 3000,
  },
  box: {
    styles: {
      transform: [
        0, t => `scale(${t * 0.1 + 1}, ${t * -0.1 + 1})`,
        900, t => `scale(${t * -0.1 + 1.1}, ${t * 0.1 + 0.9})`,
        1000, t => `translate(0, ${launchT(t) * -50}%) scale(1, ${sinHalfT(launchT(t)) * 0.1 + 1})`,
        1500, t => `translate(0, ${(t * t) * 50 + -50}%) scale(1, ${sinHalfT(t * t) * 0.1 + 1})`,
        2000, t => `scale(${sinQuarterT(t) * 0.1 + 1}, ${sinQuarterT(t) * -0.1 + 1})`,
        2100, t => `scale(${t * -0.1 + 1.1}, ${t * 0.1 + 0.9})`,
      ],
      transformOrigin: [
        0, '50% 100% 0',
      ],
    },
  },
};
