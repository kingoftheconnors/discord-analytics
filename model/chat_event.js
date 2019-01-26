const db = require("../config/db");

class ChatEvent {
  constructor(data) {
    this.data = data;
  }

  save() {
    db("user_chat")
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
