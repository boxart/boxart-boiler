const sinHalfT = t => Math.sin(t * Math.PI);
const sinQuarterT = t => Math.sin(t * Math.PI / 2);
const launchT = t => -(t - 1) * (t - 1) + 1;

export default {
  metadata: {
    name: 'Card - Flip',
    duration: 3000,
  },
  box: {
    styles: {
      transform: [
        0, t => `perspective(1000px) rotateY(${t * 90}deg) scale(${t * 0.2 + 1})`,
        375, t => `perspective(1000px) rotateY(${90 + t * 90}deg) scale(${1.2 - t * 0.2})`,
        750, t => `perspective(1000px) rotateY(180deg)`,
        1250, t => `perspective(1000px) rotateY(${(1 - t) * 90 + 90}deg) scale(${t * 0.2 + 1})`,
        1625, t => `perspective(1000px) rotateY(${(1 - t) * 90}deg) scale(${1.2 - t * 0.2})`,
        2000, t => `perspective(1000px) rotateY(0deg)`,
      ],
      transformOrigin: [
        0, '50% 50% 0',
      ],
    },
  },
};
