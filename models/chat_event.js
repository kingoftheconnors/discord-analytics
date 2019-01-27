const db = require("../config/db");

const USER_CHAT = "user_chat";

class ChatEvent {
  constructor(data) {
    this.data = data;
  }

  static attachmentCount() {
    return db
      .table(USER_CHAT)
      .sum("attachments")
      .first();
  }

  static userAttachmentCount(username) {
    return db
      .table(USER_CHAT)
      .sum("attachments")
      .where({ username: username })
      .first();
  }

  static byDay(user_id, day) {
    return db
      .select()
      .table(USER_CHAT)
      .where({ user_id: user_id })
      .whereRaw("extract(dow from timestamp) = ?", day);
  }

  static byWeek(user_id) {
    return db
      .select()
      .table(USER_CHAT)
      .where({ user_id: user_id });
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
