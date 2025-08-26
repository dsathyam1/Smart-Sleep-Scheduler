const notifier = require("node-notifier");
const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);
const logger = require("./logger");

class SleepManager {
  constructor(countdownSec, cooldownMin) {
    this.countdown = countdownSec;
    this.cooldown = cooldownMin * 60 * 1000;
    this.lastSleep = 0;
    this.timeout = null;
  }

  canSleepAgain() {
    return Date.now() - this.lastSleep > this.cooldown;
  }

  async triggerSleep(reason = "Unknown") {
    try {
      notifier.notify({
        title: "Smart Sleep Scheduler",
        message: "Your PC will sleep now...",
        sound: true,
      });
    } catch (err) {
      logger.error(`Notifier error before sleep: ${err.message}`);
    }

    logger.info(`Sleep triggered | Reason: ${reason}`);

    let command = "";
    const platform = process.platform;

    if (platform === "win32") {
      command =
        "powershell -Command \"Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Application]::SetSuspendState('Suspend', $false, $false)\"";
    } else if (platform === "linux") {
      command = "systemctl suspend";
    } else if (platform === "darwin") {
      command = "pmset sleepnow";
    } else {
      logger.warn("Unsupported OS for automatic sleep.");
      return;
    }

    logger.info(`Executing command: ${command}`);

    try {
      await execAsync(command);
      logger.info("PC is now sleeping...");
      this.lastSleep = Date.now();
    } catch (err) {
      logger.error(`Error putting PC to sleep: ${err.message}`);
    }
  }

  scheduleCountdown(reason = "Idle timeout") {
    if (this.timeout) {
      logger.info("Sleep countdown already scheduled. Skipping...");
      return;
    }

    notifier.notify({
      title: "Smart Sleep Scheduler",
      message: `PC will sleep in ${this.countdown} seconds. Click to cancel.`,
      sound: true,
    });

    logger.info(`Sleep countdown started | PC will sleep in ${this.countdown} seconds`);

    this.timeout = setTimeout(() => {
      logger.info("Countdown finished. Triggering sleep...");
      this.triggerSleep(reason);
      this.timeout = null;
    }, this.countdown * 1000);

    notifier.removeAllListeners("click");
    notifier.on("click", () => {
      clearTimeout(this.timeout);
      this.timeout = null;
      logger.info("Sleep cancelled by user");
      notifier.notify({
        title: "Smart Sleep Scheduler",
        message: "Sleep cancelled",
        sound: true,
      });
    });
  }
}

module.exports = { SleepManager };
