// src/multisynq/ChatModel.js
import { Model } from "multisynq";
import { randomName } from "../utils/names";

export class ChatModel extends Model {
  init() {
    this.views = new Map();       // Track users: viewId → { nickname, address }
    this.history = [];            // Chat messages
    this.participants = 0;        // Online users
    this.lastPostTime = null;     // Track inactivity

    // Event subscriptions
    this.subscribe(this.sessionId, "view-join", this.viewJoin);
    this.subscribe(this.sessionId, "view-exit", this.viewExit);
    this.subscribe("input", "newPost", this.newPost);
    this.subscribe("input", "sendMon", this.sendMon); // New MON transfer handler
  }

  // Associate wallet address with user
  viewJoin(viewId, { address }) {
    if (!this.views.get(viewId)) {
      this.views.set(viewId, {
        nickname: randomName(),
        address: address || null,
      });
    }
    this.participants++;
    this.publish("viewInfo", "refresh");
  }

  // Handle MON transfers
  async sendMon({ fromViewId, toNickname, amount }) {
    const fromUser = this.views.get(fromViewId);
    const toUser = Array.from(this.views.values()).find(
      (user) => user.nickname === toNickname
    );

    if (!toUser) throw new Error("Recipient not found");
    if (!fromUser.address) throw new Error("Sender wallet not connected");

    // Broadcast transfer message
    this.addToHistory({
      html: `💰 <b>${fromUser.nickname}</b> sent ${amount} MON to <b>${toNickname}</b>`,
    });

    // In a real app, you'd sign the TX here via ethers.js
    console.log(`Transfer ${amount} MON from ${fromUser.address} to ${toUser.address}`);
  }

  // ... (rest of your existing methods)
}