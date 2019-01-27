const db = require("../config/db");

const USER_ACTIVITY = "user_activity";

class PresenceEvent {
  constructor(data) {
    this.data = data;
  }

  save() {
    // Save to database
    db(USER_ACTIVITY)
      .insert(this.data)
      .then(_result => {
        console.log("Saved activity: ", this.data);
      })
      .catch(error => {
        console.log("Failed to save activity: ", this.data, error);
      });
  }
}

module.exports = PresenceEvent;
