import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/v1/chat/completions", async (req, res) => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: req.body.messages[0].content }]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    res.json({
      id: "proxy",
      object: "chat.completion",
      choices: [
        {
          message: {
            role: "assistant",
            content: data.candidates?.[0]?.content?.[0]?.text || ""
          }
        },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Proxy running"));
