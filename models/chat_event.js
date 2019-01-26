const db = require("../config/db");

const USER_CHAT = "user_chat";

class ChatEvent {
  constructor(data) {
    this.data = data;
  }

  static byDay(username, day) {
    return db
      .select()
      .table(USER_CHAT)
      .where({ username: username })
      .whereRaw("extract(dow from timestamp) = ?", day);
  }

  static byWeek(username) {
    return db
      .select()
      .table(USER_CHAT)
      .where({ username: username });
  }

  save() {
    db(USER_CHAT)
      .insert(this.data)
      .then(_result => {
        console.log("Saved chat event: ", this.data);
      })
      .catch(error => {
        console.log("Failed to save chat event: ", this.data, error);
      });
  }
}

module.exports = ChatEvent;
