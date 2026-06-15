import 'dotenv/config';
import { generateChatTitle, generateResponse } from './src/services/ai.service.js';

async function test() {
  try {
    console.log("Testing generateChatTitle...");
    const title = await generateChatTitle("hello");
    console.log("Title:", title);

    console.log("Testing generateResponse...");
    const response = await generateResponse([{ role: "user", content: "hello" }]);
    console.log("Response:", response);
  } catch (err) {
    console.error("Test failed:", err);
  }
}
test();
