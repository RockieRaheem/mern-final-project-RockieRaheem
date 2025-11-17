import "dotenv/config";
import fetch from "node-fetch";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Error: GEMINI_API_KEY not set in environment");
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

  try {
    console.log("Fetching models from Google Generative Language API...");
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error("API error:", data);
      process.exit(1);
    }

    if (!data.models || data.models.length === 0) {
      console.log("No models returned:", data);
      return;
    }

    console.log("\nAvailable models:");
    data.models.forEach((m) => {
      console.log(
        "- " +
          (m.name || m.model) +
          (m.displayName ? ` (${m.displayName})` : "")
      );
      if (m.supportedMethods) {
        console.log("  supportedMethods:", m.supportedMethods.join(", "));
      }
      if (m.description) {
        console.log("  description:", m.description.substring(0, 200));
      }
    });
  } catch (err) {
    console.error("Fetch error:", err);
    process.exit(1);
  }
}

listModels();
