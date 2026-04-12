export const MOTION = {
  cartBadge: {
    bounce: {
      scale: [1, 1.08, 1],
      transition: {
        duration: 0.18,
        ease: "easeOut",
      },
    },
    recoil: {
      x: [0, -3, 2, 0],
      transition: {
        duration: 0.22,
        ease: "easeOut",
      },
    },
    glowPulse: {
      boxShadow: [
        "0 0 0px rgba(0,0,0,0)",
        "0 0 8px rgba(168,85,247,0.9)",
        "0 0 0px rgba(0,0,0,0)",
      ],
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    particle: {
      count: 8,
      duration: 0.4,
    },
  },
};