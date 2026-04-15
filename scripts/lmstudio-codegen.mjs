import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

function getArg(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  return args[i + 1] ?? null;
}

function getMultiArg(name) {
  const values = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === name && args[i + 1]) {
      values.push(args[i + 1]);
      i++;
    }
  }
  return values;
}

function hasArg(name) {
  return args.includes(name);
}

async function readInstruction() {
  const direct = getArg("--instruction");
  const file = getArg("--instruction-file");

  if (direct) return direct;
  if (file) {
    const text = await fs.readFile(file, "utf8");
    return text.trim();
  }

  throw new Error("Missing instruction. Use --instruction or --instruction-file.");
}

async function readContextFiles(files) {
  if (files.length === 0) return "";

  const chunks = [];
  for (const file of files) {
    const resolved = path.resolve(file);
    const content = await fs.readFile(resolved, "utf8");
    chunks.push(`FILE: ${resolved}\n\n${content}`);
  }

  return chunks.join("\n\n---\n\n");
}

async function main() {
  const endpoint = getArg("--endpoint") || "http://127.0.0.1:1234";
  const model = getArg("--model") || "qwen/qwen3-coder-30b";
  const temperature = Number(getArg("--temperature") || "0.2");
  const maxTokens = Number(getArg("--max-tokens") || "4096");
  const files = getMultiArg("--file");
  const raw = hasArg("--raw");

  const instruction = await readInstruction();
  const fileContext = await readContextFiles(files);

  const systemPrompt = [
    "You are Qwen3-Coder generating production-ready code.",
    "Return only the final code or patch content unless the user asks for explanation.",
    "Respect the provided file context and instruction exactly."
  ].join(" ");

  const userPrompt = [
    `Instruction:\n${instruction}`,
    fileContext ? `\n\nProject context:\n${fileContext}` : ""
  ].join("");

  const body = {
    model,
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  };

  const res = await fetch(`${endpoint}/v1/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LM Studio error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (raw) {
    console.log(JSON.stringify(json, null, 2));
    return;
  }

  const content = json?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No content in LM Studio response.");
  }

  console.log(content);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
