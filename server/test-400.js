import 'dotenv/config';
import { generateChatTitle, generateResponse } from './src/services/ai.service.js';

async function test() {
  try {
    console.log("Testing generateChatTitle...");
    const title = await generateChatTitle("hello");
    console.log("Title:", title);
  } catch (err) {
    console.error("ChatTitle Error:", err.message);
    if(err.response) console.error("Response data:", err.response.data);
  }

  try {
    console.log("Testing generateResponse...");
    const response = await generateResponse([{ role: "user", content: "hello" }]);
    console.log("Response:", response);
  } catch (err) {
    console.error("Response Error:", err.message);
    if(err.response) console.error("Response data:", err.response.data);
  }
}
test();
