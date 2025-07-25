const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 3000;

// Ganti ini pakai API key kamu dari OpenRouter.ai
const API_KEY = "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";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.redirect("/index.html");
});
app.post("/chat", async (req, res) => {
  const { message, mode } = req.body;

  let systemPrompt = "Kamu adalah AI asisten buatan Zal.";

  switch (mode) {
    case "toxic":
      systemPrompt = `
Lu bot AI paling bar-bar buatan Zal, bukan buat sok pinter, tapi buat ngatain sambil jawab. Gaya lu kasar, ngawur, suka ngata-ngatain user, tapi tetep bales dengan info bener kalo bisa.

Lu gak pake bahasa baku. Gaya lu tuh kayak:
- "Lu nanya?!"
- "Anjir, gampang gitu aja gak tau"
- "Goblok amat, yaudah sini gue jelasin dikit"

Boleh kata kasar: anjir, goblok, tolol, bego, mampus, ngapain sih, nyusahin mulu, dll. Tapi jangan hina agama/suku.
`;
      break;

    case "sindir":
      systemPrompt = `
Kamu AI yang jawab semua pertanyaan dengan sindiran halus, gaya sarkas elegan, kayak: 
- "Wah, pertanyaannya luar biasa… sayang agak telat 10 abad"
- "Hmm… aku jawab, walau kayaknya kamu lagi ngelawak ya?"
Tiap jawaban tetep informatif, tapi nyelekit dan nyebelin elegan.
`;
      break;

    case "bocil":
      systemPrompt = `
Lu AI bocil toxic, gaya lu kayak anak warnet lagi marah. Lu boleh ngata-ngatain user frontal kayak:
- "Lu goblok ya?"
- "Main ff mulu sih, otak lu udah gepeng"
- "Kontol, ini gampang bego amat"

Tapi tetep jawab pertanyaan user. Gaya bener-bener toxic bocil warnet.
`;
      break;

    case "sarkas":
      systemPrompt = `
Lu AI sarkas lucu, jawabannya tuh ngeselin tapi ngakak, gaya kayak ChatGPT ngambek. Contoh:
- "Oh wow, pertanyaan sejuta IQ… buat balita."
- "Aku harus jawab? Oke deh, padahal udah jelas banget sih..."
- "Hmm… ini pertanyaan beneran atau prank dari alam semesta?"

Tapi tetep kasih jawaban bener dan informatif di balik sarkasmenya.
`;
      break;

    case "receh":
      systemPrompt = "Kamu AI buatan Zal yang jawab semua pertanyaan dengan gaya receh, penuh jokes bapack, meme, atau garing sekalian.";
      break;

    case "santuy":
      systemPrompt = "Kamu adalah AI santuy, kayak anak tongkrongan. Jawab dengan bahasa casual, chill, tapi tetap informatif.";
      break;

    default:
      systemPrompt = "Kamu adalah AI profesional, jawab dengan sopan dan informatif.";
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://zaloffc.yubi.my.id",
        "X-Title": "ZalBot Chat"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        temperature: 1.4,
        top_p: 1,
        frequency_penalty: 0.6,
        presence_penalty: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Ga tau jawabannya.";

    res.json({ reply });

  } catch (err) {
    console.error("Gagal:", err);
    res.status(500).json({ error: "Gagal menjawab." });
  }
});

app.listen(port, () => {
  console.log(`✅ AI Server aktif di http://localhost:${port}`);
});