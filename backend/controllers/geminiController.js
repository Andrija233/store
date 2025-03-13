import { GoogleGenerativeAI } from "@google/generative-ai"
import dotenv from "dotenv";
dotenv.config();

const googleai = new GoogleGenerativeAI(process.env.VITE_GOOGLE_AI_API_KEY);



export class AssistantGemini {
    #chat;
  constructor(model = "gemini-1.5-flash") {
    const gemini = googleai.getGenerativeModel({model});
    this.#chat = gemini.startChat({
      history: []
    });
  }

  async chat(content) {
    try {
      const result = await this.#chat.sendMessage(content);
      return result.response.text();  
    } catch (error) {
      console.log(error);
    }
  }

  async *chatStream(content){
    try {
      const result = await this.#chat.sendMessageStream(content);
      for await (const chunk of result.stream){
        // just like return, but it returns a generator with next method and can be iterated
        yield chunk.text();
      }
    } catch (error) {
      console.log(error);
    }
  }
}