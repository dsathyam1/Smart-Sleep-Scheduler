const { IdleMonitor } = require("./idleMonitor");
const { SleepManager } = require("./sleepManager");
const logger = require("./logger");
const { formatTime } = require("./utils");
const config = require("../config/config.json");
const Joi = require("joi");

const schema = Joi.object({
  IDLE_THRESHOLD: Joi.number().min(1).required(),
  CONTINUOUS_IDLE_THRESHOLD: Joi.number().min(1).required(),
  SCHEDULE_HOURS: Joi.number().integer().min(0).max(23).required(),
  SCHEDULE_MINUTES: Joi.number().integer().min(0).max(59).required(),
  SLEEP_COUNTDOWN: Joi.number().min(5).default(30),
  SLEEP_COOLDOWN_MINUTES: Joi.number().min(1).default(10),
});

const { error, value: cfg } = schema.validate(config);
if (error) throw new Error(`Invalid config: ${error.message}`);
const idleMonitor = new IdleMonitor(
  cfg.IDLE_THRESHOLD,
  cfg.CONTINUOUS_IDLE_THRESHOLD
);
const sleepManager = new SleepManager(
  cfg.SLEEP_COUNTDOWN,
  cfg.SLEEP_COOLDOWN_MINUTES
);
let hasSlept = false;

setInterval(() => {
  try {
    const now = new Date();
    const isAfterScheduledTime =
      now.getHours() > cfg.SCHEDULE_HOURS ||
      (now.getHours() === cfg.SCHEDULE_HOURS &&
        now.getMinutes() >= cfg.SCHEDULE_MINUTES);

    const { idleSeconds, state } = idleMonitor.getState();
    logger.debug(
      `Idle time: ${formatTime(
        idleSeconds
      )}, State: ${state}, Time: ${now.getHours()}:${now.getMinutes()}`
    );

    if (!isAfterScheduledTime) {
      idleMonitor.idleCounter = 0;
      hasSlept = false;
      return;
    }

    idleMonitor.update(state);

    if (
      state === "idle" &&
      idleMonitor.isIdleLongEnough() &&
      !hasSlept &&
      sleepManager.canSleepAgain()
    ) {
      logger.info(
        `User idle for ${formatTime(
          cfg.CONTINUOUS_IDLE_THRESHOLD
        )} after schedule. Starting countdown...`
      );
      sleepManager.scheduleCountdown();
      hasSlept = true;
    }
  } catch (err) {
    logger.error(`Unexpected error in main loop: ${err.message}`);
  }
}, 1000);
