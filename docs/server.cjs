var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.js
var import_config = require("dotenv/config");
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "10mb" }));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, systemInstruction, temperature, apiKey } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "A message prompt is required." });
      }
      const defaultSystemPrompt = systemInstruction || "You are grrmondays AI, an intelligent, helpful, and friendly AI assistant. You assist users with homework, science, history, programming, math formulas, gaming, and general research. Provide direct, informative, well-formatted markdown answers with helpful lists, bold emphasis, and code blocks.";
      const promptText = message.trim();
      const requestedKey = apiKey && typeof apiKey === "string" && apiKey.trim() || "";
      if (requestedKey.startsWith("sk-navy-")) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4e3);
          const navyMessages = [
            { role: "system", content: defaultSystemPrompt }
          ];
          if (Array.isArray(history)) {
            for (const item of history) {
              if (item && item.text && typeof item.text === "string" && item.text.trim()) {
                navyMessages.push({
                  role: item.role === "model" || item.role === "ai" || item.role === "assistant" ? "assistant" : "user",
                  content: item.text.trim()
                });
              }
            }
          }
          navyMessages.push({
            role: "user",
            content: promptText
          });
          const navyResponse = await fetch("https://api.navy/v1/chat/completions", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${requestedKey}`
            },
            body: JSON.stringify({
              model: "gemini-3.8-flash",
              messages: navyMessages,
              temperature: typeof temperature === "number" ? Math.max(0, Math.min(2, temperature)) : 0.7
            })
          });
          clearTimeout(timeoutId);
          if (navyResponse.ok) {
            const navyData = await navyResponse.json();
            const navyReply = navyData.choices?.[0]?.message?.content;
            if (navyReply && typeof navyReply === "string" && navyReply.trim()) {
              return res.json({ reply: navyReply.trim(), provider: "navy" });
            }
          }
        } catch {
        }
      }
      const geminiApiKey = !requestedKey.startsWith("sk-navy-") && requestedKey || process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        return res.status(400).json({
          error: "No valid AI API key available. Please configure your API key in Settings."
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey: geminiApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const contents = [];
      if (Array.isArray(history)) {
        for (const item of history) {
          if (item && item.text && typeof item.text === "string" && item.text.trim()) {
            contents.push({
              role: item.role === "model" || item.role === "ai" || item.role === "assistant" ? "model" : "user",
              parts: [{ text: item.text.trim() }]
            });
          }
        }
      }
      contents.push({
        role: "user",
        parts: [{ text: promptText }]
      });
      const candidateModels = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"];
      let lastGeminiError = null;
      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: defaultSystemPrompt,
              temperature: typeof temperature === "number" ? Math.max(0, Math.min(2, temperature)) : 0.7
            }
          });
          const reply = response.text || "No response content was generated.";
          return res.json({ reply, provider: "gemini", model: modelName });
        } catch (err) {
          lastGeminiError = err;
          const isRetryable = err?.status === 503 || err?.message?.includes("503") || err?.message?.includes("high demand") || err?.message?.includes("UNAVAILABLE") || err?.status === 429 || err?.message?.includes("429");
          if (isRetryable) {
            continue;
          }
          break;
        }
      }
      throw lastGeminiError || new Error("All AI generation models failed.");
    } catch (err) {
      console.error("AI Service Error:", err);
      const errorMessage = err?.message || "An unexpected error occurred while communicating with the AI service.";
      return res.status(500).json({ error: errorMessage });
    }
  });
  const distPath = import_path.default.join(process.cwd(), "dist");
  const distIndexHtml = import_path.default.join(distPath, "index.html");
  if (process.env.NODE_ENV === "production" && import_fs.default.existsSync(distIndexHtml)) {
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(distIndexHtml);
    });
  } else {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
