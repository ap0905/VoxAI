const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const OpenAI = require("openai");
const messages = [];

const openai = new OpenAI({
  apiKey: "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",
});

async function main(input) {
  messages.push({ role: "user", content: input });
  console.log(messages);
  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0]?.message?.content;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "templates/index.html"));
});

app.post("/api", async function (req, res, next) {
  const input = req.body.input;
  console.log("Received input:", input);

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "gpt-3.5-turbo",
    });

    const response = completion.choices[0]?.message?.content;
    console.log("Response from OpenAI:", response);

    if (response) {
      res.json({ success: true, message: response });
    } else {
      res.status(500).json({ success: false, error: "No response from OpenAI" });
    }
  } catch (error) {
    console.error("Error processing input:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});



app.listen(port, () => {
  console.log("Running...");
  // Code.....
});
