
# 🖥️ 

A cross-platform Node.js scheduler that automatically puts your PC to sleep when idle after scheduled hours, with countdown notifications, cooldown handling, and activity logging.

---

## ✨ Features
- ⏰ **Schedule-based** – only runs after a configurable time (e.g., after midnight).
- 💤 **Idle detection** – monitors real user idle state for accuracy.
- ⏳ **Sleep countdown** – warns user before sleep, with option to cancel.
- 🔁 **Cooldown handling** – prevents repeated sleep cycles within a short period.
- 📑 **Persistent logging** – logs all state changes and sleep triggers.
- 🖥️ **Cross-platform** – works on **Windows, Linux, and macOS**.

---

## 🚀 Installation
```bash
# Clone repository
git clone https://github.com/dsathyam1/Smart-Sleep-Scheduler
cd idlesleepscheduler

# Install dependencies
npm install
````

---

## ⚙️ Configuration

Edit the `config.json` file to set your preferences:

```json
{
  "IDLE_THRESHOLD": 60,
  "CONTINUOUS_IDLE_THRESHOLD": 300,
  "SCHEDULE_HOURS": 0,
  "SCHEDULE_MINUTES": 0,
  "SLEEP_COUNTDOWN": 30,
  "SLEEP_COOLDOWN_MINUTES": 10
}
```

### Config fields:

* **`IDLE_THRESHOLD`**: Seconds of inactivity before marking user idle.
* **`CONTINUOUS_IDLE_THRESHOLD`**: How long user must remain idle before sleep countdown begins.
* **`SCHEDULE_HOURS` / `SCHEDULE_MINUTES`**: Time after which sleep can be triggered.
* **`SLEEP_COUNTDOWN`**: Countdown in seconds before sleep (user can cancel).
* **`SLEEP_COOLDOWN_MINUTES`**: Minimum time between consecutive sleep triggers.

---

## ▶️ Usage

Run the scheduler with:

```bash
node index.js
```

The program will monitor your activity.
When idle conditions are met after the scheduled time, it starts a countdown and then puts the system to sleep (unless cancelled).

---

## 📜 Logs

Events are saved in `history_log.txt`, including:

* Idle/active state changes
* Sleep countdowns
* User cancellations
* Sleep triggers and reasons

---

## 🔧 Cross-Platform Notes

* **Windows**: Uses PowerShell `SetSuspendState`. May require administrator privileges.
* **Linux**: Uses `systemctl suspend`. Ensure `systemd` is available.
* **macOS**: Uses `pmset sleepnow`.

---

## 🧪 Development

* Code style: [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/)
* Planned tests with [Jest](https://jestjs.io/)
