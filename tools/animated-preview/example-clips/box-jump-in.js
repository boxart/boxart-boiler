const createArc = (b, a) => {
  const bb = Math.pow(b, 2);
  const bbOverA = Math.sqrt(bb / a);
  return t => Math.pow(t * (b + bbOverA) - bbOverA, 2) / bb;
};

const arc = createArc(Math.sqrt(0.75), 3 / 2);

export default {
  metadata: {
    name: 'Box - Jump In',
    duration: 1000,
  },
  box: {
    styles: {
      transform: [
        0, t => `translate3d(0, ${arc(t) * 75 - 75}%, 0) scale(${t * t})`,
      ],
      transformOrigin: [
        0, '50% 100% 0',
      ],
    },
  },
};
