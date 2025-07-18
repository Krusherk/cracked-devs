// src/multisynq/ChatView.js
import { randomName } from "./randomName";

export class ChatView {
  constructor(model, { address }) {
    this.model = model;
    this.address = address;
    this.viewId = crypto.randomUUID();
    this.nickname = randomName();

    this.model.views.set(this.viewId, this);
    this.model.addToHistory({
      html: `🎉 <b>${this.nickname}</b> joined the chat.`,
      viewId: this.viewId,
    });
  }

  send(text) {
    if (!text.trim()) return;
    this.model.addToHistory({
      html: `<b>${this.nickname}:</b> ${text}`,
      viewId: this.viewId,
    });
  }

  sendMon(toNickname, amount) {
    this.model.addToHistory({
      html: `💸 <b>${this.nickname}</b> sent <b>${amount} MON</b> to <b>@${toNickname}</b>`,
      viewId: this.viewId,
    });
  }

  refreshViewInfo() {
    // Optional: can be overridden in App.jsx
  }
}
