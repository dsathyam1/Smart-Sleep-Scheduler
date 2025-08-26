const RealIdle = require("@paymoapp/real-idle");
const logger = require("./logger");

class IdleMonitor {
  constructor(threshold, continuousThreshold) {
    this.threshold = threshold;
    this.continuousThreshold = continuousThreshold;
    this.idleCounter = 0;
  }

  getState() {
    const idleSeconds = RealIdle.getIdleSeconds();
    const state = RealIdle.getIdleState(this.threshold);
    return { idleSeconds, state };
  }

  update(state) {
    if (state === "idle") {
      this.idleCounter++;
      if (this.idleCounter === 1) logger.info("User state: idle");
    } else {
      if (this.idleCounter > 0) logger.info("User state: active");
      this.idleCounter = 0;
    }
  }

  isIdleLongEnough() {
    return this.idleCounter >= this.continuousThreshold;
  }
}

module.exports = { IdleMonitor };
