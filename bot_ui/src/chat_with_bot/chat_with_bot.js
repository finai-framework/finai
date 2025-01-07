import axios from "axios";
import React, { useState } from "react";
import { NGROK_FRONTEND } from "../domain";

function ChatWithBot() {
  const [messages, setMessages] = useState([]); // Lưu trữ các tin nhắn
  const [userInput, setUserInput] = useState(""); // Lưu trữ nội dung nhập từ người dùng

  // Hàm giả lập nhận tin nhắn từ bot
  const getMessFromBot = async (content) => {
    let conversation = [...messages, content].map((message, index) =>
      `${index % 2 === 0 ? `User: "${message}"` : `"${message}"`}`)
      .join("\n");
    // axios to get response from bot
    let url = NGROK_FRONTEND
    try {
      const response = await axios.post(`${url}/chat/reply`, {
        "conversation": conversation,
      });
      const botResponse = `${response.data.choices[0].message.content}`;
      return botResponse;
    }
    catch (error) {
      console.error(error);
      return `Bot: I'm sorry, I don't understand what you're saying. ${error}`;
    }
  };

  // Hàm gửi tin nhắn
  const sendMessage = async () => {
    if (!userInput.trim()) return; // Nếu không có nội dung, không gửi

    const userMessage = `User: ${userInput}`;
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Lấy phản hồi từ bot
    const botMessage = await getMessFromBot(userInput);
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    // Xóa nội dung input
    setUserInput("");
  };

  return (
    <div className="ChatWithBot">
      <div className="chat-window" style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll" }}>
        {messages.map((message, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            {message}
          </div>
        ))}
      </div>
      <div className="chat-input" style={{ marginTop: "10px" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          style={{ padding: "5px", width: "80%" }}
        />
        <button onClick={sendMessage} style={{ padding: "5px 10px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWithBot;
