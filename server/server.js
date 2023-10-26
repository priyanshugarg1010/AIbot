import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", async (req, res) => {
  res.status(200).send("hello from your personalise AI bot");
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    console.log(response.choices[0].message);

    res.status(200).send({ bot: response.data.choices[0].text });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

app.listen(8080, () => console.log("server running"));
