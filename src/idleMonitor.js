const RealIdle = require("@paymoapp/real-idle");
const logger = require("./logger");

class IdleMonitor {
  constructor(threshold, continuousThreshold) {
    this.threshold = threshold; 
    this.continuousThreshold = continuousThreshold; 
    this.idleCounter = 0;
    this.isIdle = false; 
  }

  getState() {
    const idleSeconds = RealIdle.getIdleSeconds();
    const state = RealIdle.getIdleState(this.threshold); 
    return { idleSeconds, state };
  }

  update(state) {
    if (state === "idle") {
      this.idleCounter++;

      if (!this.isIdle) {
        this.isIdle = true;
        logger.info(`🟢 User went idle (threshold reached: ${this.threshold}s)`);
      }
    } else {
      if (this.isIdle) {
        logger.info("🔵 User is active again");
      }
      this.isIdle = false;
      this.idleCounter = 0;
    }
  }

  isIdleLongEnough() {
    return this.idleCounter >= this.continuousThreshold;
  }
}

module.exports = { IdleMonitor };
