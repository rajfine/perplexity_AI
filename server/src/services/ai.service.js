import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import {HumanMessage, SystemMessage, AIMessage} from '@langchain/core/messages'
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import * as z from 'zod' // description dene ke liye
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GOOGLE_API_KEY
})

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
})

const getMessageText = (content) => {
  if (typeof content === "string") {
    return content
  }

  if (Array.isArray(content)) {
    return content
      .map((block) => {
        if (typeof block === "string") return block
        return block?.text || ""
      })
      .join("")
  }

  return ""
}

export const generateResponse = async (messages)=>{
  const formattedMessages = messages
    .filter((msg) => msg?.content && (msg.role === "user" || msg.role === "ai"))
    .map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content)
      }
      return new AIMessage(msg.content)
    })
  if (formattedMessages.length === 0) {
    throw new Error("No valid messages found for AI response generation")
  }

  const response = await agent.invoke({messages:formattedMessages})
  const lastAiMessage = response.messages
    .filter((msg) => msg._getType?.() === "ai")
    .at(-1)

  const text = getMessageText(lastAiMessage?.content)

  if (!text) {
    throw new Error("AI generated an empty response")
  }

  return text
}

export const generateChatTitle = async (firstMessage)=>{
  
  const response = await mistralModel.invoke([
    new SystemMessage(`
      you are helpful assistant that generate concise and meaningful title , for chat convo.

      user will provide you with first message of the chat convo, and you will generate title for that convo, title should be concise and meaningful.
      it must be less than 2-5 words, and should capture the essence of the conversation.
    `),

    new HumanMessage(`
      generate title for this chat convo:
      ${firstMessage}
    `)
  ])
  return response.text
}

export const searchInternetTool = tool(
  searchInternet,
  {
    name: "searchInternet",
    description: "use this tool to get an latest information from the internet.",
    schema: z.object({
      query: z.string().describe("the search query to look up on the internet.")
    })
  }
)

const  agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
  systemPrompt: `
    You are a helpful assistant with access to a searchInternet tool.
    For any question about today, current date, current day, latest, recent, news, prices, weather, or live information, you MUST call searchInternet before answering.
    Do not say you cannot access real-time information. Use the tool.
    if i ask currwnt date then tell me its important
  `

})

// export const testAi =  () => {
//   const model = getModel()
//   model.invoke("what is the capital of india?")
//     .then((res) => {
//       console.log(res.text)
//     })
// }
