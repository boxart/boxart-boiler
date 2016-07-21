const fadeOut = [
  0, t => 1 - t,
  500, 0,
];

module.exports = {
  metadata: {
    name: 'Shell - Burst',
    duration: 1000,
  },

  box: {
    styles: {
      zIndex: [
        0, 1,
      ],
    },
  },

  shellCover: {
    styles: {
      opacity: [
        0, 0,
      ],
    },
  },

  shellChick: {
    styles: {
      transform: [
        0, t => `translate3d(0, ${Math.sin(t * Math.PI / 2) * -50}%, 0)`,
        500, t => `translate3d(0, -50%, 0)`,
      ],
      opacity: [
        0, t => 1,
        900, t => 1 - t,
        1000, 0,
      ],
    },
  },

  shellTop: {
    styles: {
      transform: [
        0, t => `translate3d(0, ${Math.sin(t * Math.PI / 8 * 3) * -175}%, 0)`,
        500, t => `translate3d(0, -175%, 0)`,
      ],
      opacity: fadeOut,
    },
  },

  shellRight: {
    styles: {
      transform: [
        0, t => `translate3d(${t * 75}%, ${Math.sin(t * Math.PI / 8 * 3) * -75}%, 0)`,
        500, t => `translate3d(75%, -75%, 0)`,
      ],
      opacity: fadeOut,
    },
  },

  shellBottom: {
    styles: {
      transform: [
        0, t => `translate3d(0, ${(1 - Math.sin(t * Math.PI / 8 * 3 + Math.PI / 2)) * 35}%, 0)`,
        500, t => `translate3d(0, 35%, 0)`,
      ],
      opacity: fadeOut,
    },
  },

  shellLeft: {
    styles: {
      transform: [
        0, t => `translate3d(${t * -75}%, ${Math.sin(t * Math.PI / 8 * 3) * -75}%, 0)`,
        500, t => `translate3d(-75%, -75%, 0)`,
      ],
      opacity: fadeOut,
    },
  },
};
