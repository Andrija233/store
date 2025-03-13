import express from "express";
import { AssistantGemini } from "../controllers/geminiController.js";

const router = express.Router();

const gemini = new AssistantGemini();

router.route('/').post(async (req, res) => {
    try {
      const { message } = req.body;
      const response = gemini.chatStream(message);
  
      let responseText = "";
      for await (const chunk of response) {
        responseText += chunk;
      }
  
      res.json({ response: responseText });
    } catch (error) {
      console.error("Error generating response:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;