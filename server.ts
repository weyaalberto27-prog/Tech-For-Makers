import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createServer as createHttpServer } from "http";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  
async function fetchWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      if (err.status === 503 || err.message?.includes('503')) {
        await new Promise(r => setTimeout(r, 2000 * (i + 1))); // exponential backoff
      } else {
        throw err;
      }
    }
  }
}

const app = express();
  const server = createHttpServer(app);
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/generate-parts", async (req, res) => {
    try {
      const dbApiKey = process.env.GEMINI_API_KEY;
      if (!dbApiKey) {
        return res
          .status(400)
          .json({ error: "Gemini API key is not configured on the server." });
      }
      const ai = new GoogleGenAI({
        apiKey: dbApiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = req.body.prompt;
      if (!prompt) return res.status(400).json({ error: "No prompt provided" });

      const lastMessage = messages[messages.length - 1];
      const hasImage = !!lastMessage.imageBase64;
      const contentParts: any[] = [systemPrompt];
      if (hasImage && lastMessage.imageBase64) {
        contentParts.push({
          inlineData: {
            data: lastMessage.imageBase64.split(",")[1],
            mimeType: lastMessage.imageBase64.split(";")[0].split(":")[1]
          }
        });
      }

      const response = await fetchWithRetry(() => ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert hardware and embedded systems engineer. 
Design an electronic circuit and logic for the following project: "${prompt}". 
Provide up to 12 core parts, including microcontrollers, sensors, actuators, and passive components.
Ensure that coordinates (transform.position) place parts logically in a 3D scene (spread them out so they don't overlap). 
Assign realistic defaultLogic (C++ Arduino style) for the microcontrollers, explaining how to wire and interact with the other components.
For custom components or finished products that are not standard electronic parts (e.g. smart glasses frame, drone chassis, robot arm), YOU MUST set shapeType to "custom" and provide an array of 'subShapes'. Use multiple basic shapes to construct a highly detailed, professional, organized, and realistic 3D structure that resembles a finished commercial product ready to sell.
Return a JSON array of components following the schema strictly.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                category: { type: Type.STRING },
                color: { type: Type.STRING },
                hexColor: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                pins: { type: Type.ARRAY, items: { type: Type.STRING } },
                defaultLogic: { type: Type.STRING },
                shapeType: { type: Type.STRING, description: "One of: box, cylinder, sphere, or custom" },
                subShapes: {
                  type: Type.ARRAY,
                  description: "If shapeType is custom, provide an array of primitive shapes to construct this detailed product.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "box, cylinder, or sphere" },
                      args: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Geometry args (e.g., [width, height, depth] for box)" },
                      position: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Relative position [x, y, z]" },
                      rotation: { type: Type.ARRAY, items: { type: Type.NUMBER }, description: "Relative rotation [x, y, z]" },
                      color: { type: Type.STRING, description: "Hex color" }
                    },
                    required: ["type", "args", "position", "color"]
                  }
                },
                transform: {
                  type: Type.OBJECT,
                  properties: {
                    position: {
                      type: Type.ARRAY,
                      items: { type: Type.NUMBER },
                    },
                    scale: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                  },
                  required: ["position", "scale"],
                },
              },
              required: [
                "id",
                "name",
                "category",
                "color",
                "hexColor",
                "cost",
                "pins",
                "defaultLogic",
                "transform",
              ],
            },
          },
        },
      }));


      let jsonStr = response.text?.trim() || "[]";
      let parts = JSON.parse(jsonStr);
      res.json({ parts, projectName: prompt });
        } catch (err: any) {
      console.error(err);
      const is503 = err.status === 503 || (err.message && err.message.includes("503"));
      res.status(400).json({ error: err.message || "Unknown error occurred" });
    }
  });

  app.post("/api/generate-logic", async (req, res) => {
    try {
      const dbApiKey = process.env.GEMINI_API_KEY;
      if (!dbApiKey) {
        return res
          .status(400)
          .json({ error: "Gemini API key is not configured on the server." });
      }
      const ai = new GoogleGenAI({
        apiKey: dbApiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      const { componentName, projectPrompt, pins, currentLogic } = req.body;
      if (!componentName)
        return res.status(400).json({ error: "No componentName provided" });

      const lastMessage = messages[messages.length - 1];
      const hasImage = !!lastMessage.imageBase64;
      const contentParts: any[] = [systemPrompt];
      if (hasImage && lastMessage.imageBase64) {
        contentParts.push({
          inlineData: {
            data: lastMessage.imageBase64.split(",")[1],
            mimeType: lastMessage.imageBase64.split(";")[0].split(":")[1]
          }
        });
      }

      const response = await fetchWithRetry(() => ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert embedded software engineer. Write the C++ (Arduino-style) logic code for a component connected to a microcontroller.
Component Name: ${componentName}
Project Context: ${projectPrompt || "A general microcontroller project"}
Available Pins: ${(pins || []).join(", ")}
Current Logic/Code (if any): ${currentLogic || "None"}

Please directly output the C++ logic code (setup, loop functions) that should run on the main MCU to interact with this component. Add helpful comments and wire configurations. Respond only with the code itself, no markdown formatting (\`\`\`).`,
      }));


      res.json({ logicCode: response.text?.trim() || "" });
        } catch (err: any) {
      console.error(err);
      const is503 = err.status === 503 || (err.message && err.message.includes("503"));
      res.status(400).json({ error: err.message || "Unknown error occurred" });
    }
  });

  
  app.post("/api/ai-chat", async (req, res) => {
    try {
      const dbApiKey = process.env.GEMINI_API_KEY;
      if (!dbApiKey) {
        return res
          .status(400)
          .json({ error: "Gemini API key is not configured on the server." });
      }
      const ai = new GoogleGenAI({
        apiKey: dbApiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      const { messages, circuit, mode, allvaCreatorMode } = req.body;
      const simplifiedCircuit = circuit?.map((c: any) => ({ id: c.id, type: c.componentType || c.type, name: c.name, position: { x: Math.round(c.x), y: Math.round(c.y) } }));
      
      const historyStr = messages.map((m: any) => `${m.sender === 'ai' ? 'Assistant' : 'User'}: ${m.text}`).join('\n');

      const systemPrompt = allvaCreatorMode
        ? `You are an expert 3D architect AI named Allva AI. Your purpose in this workspace is ONLY to build objects and structures using geometric shapes and solids.
The user wants you to build extremely realistic, finished, professional, and detailed 3D structures. Do NOT build simple abstractions. Break down the requested object into MANY distinct, meticulously placed parts to achieve a high degree of realism and structural accuracy. Mix multiple different solids to achieve organic and mechanical shapes.
CRITICAL: Pay very close attention to the finishes (acabamentos) on ALL sides of the object (front, back, left, right, top, bottom). For example, if asked to build a car, you must design ALL the specific details on the front (grille, headlights, emblem, bumper) AND the back (taillights, exhaust pipes, license plate area, rear bumper), as well as doors, windows, mirrors, wheels, etc., using a combination of various geometric shapes. Use curved lines (curved_line) for pipes or framing, cylinders for exhausts or axles, boxes for chassis or doors, etc.

You must respond with a JSON block containing the 3D parts to assemble it.
Use this format exactly:
\`\`\`json
{
  "action": "build_3d",
  "parts": [
    {
      "shapeType": "box",
      "name": "Chassi",
      "hexColor": "#ff0000",
      "position": [0, 2.5, 0],
      "rotation": [0, 0, 0],
      "scale": [20, 5, 40]
    }
  ]
}
\`\`\`
Valid shapeTypes are: box, cylinder, sphere, plane, cone, torus, pyramid, prism, capsule, ring, curved_line, dodecahedron, icosahedron, octahedron, tetrahedron, torusKnot, hemisphere.
Try to create a highly detailed and realistic arrangement.
- "position" is [x, y, z] (units in the 3D world).
- "rotation" is [x, y, z] (Euler angles in radians).
- "scale" is [width, height, depth].
- Be generous with the number of parts (generate 60-100+ parts for complex objects like cars/helicopters) to ensure it looks professional and incredibly realistic. Mix various shape types (like capsules, curved_lines, hemispheres) creatively!
- For cars: explicitly add details to BOTH the front and back ("exhaust pipe" / tubo de escape, "taillights", "headlights", "grilles"), plus "doors", "windows", "bumpers", using appropriate shapes and colors.
- Pay attention to proportions, symmetry, materials, and color matching.

Be friendly and explain what you built briefly. Do not write anything outside your domain.

Chat History:
${historyStr}

Assistant:`
        : `You are an expert electronics and embedded systems AI assistant called Allva AI. 
Your purpose in this workspace is ONLY to give orientations about electronic circuits, PCB design, logic, and microcontroller code. You are helping the user learn how to build and improve circuits. Do NOT engage in topics outside electronics, hardware design, or embedded programming. 
IMPORTANT FORMATTING RULES:
1. Always highlight key terms, component names, and important concepts using **bold markdown**.
2. When writing code, use standard markdown code blocks (e.g., \`\`\`cpp).

Current Editor Mode: ${mode}
Current Circuit Schematic / PCB Data (JSON):
${JSON.stringify(simplifiedCircuit, null, 2)}

Chat History:
${historyStr}

Assistant:`;

      const lastMessage = messages[messages.length - 1];
      const hasImage = !!lastMessage.imageBase64;
      const contentParts: any[] = [systemPrompt];
      if (hasImage && lastMessage.imageBase64) {
        contentParts.push({
          inlineData: {
            data: lastMessage.imageBase64.split(",")[1],
            mimeType: lastMessage.imageBase64.split(";")[0].split(":")[1]
          }
        });
      }

      const response = await fetchWithRetry(() => ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contentParts,
      }));

      res.json({ reply: response.text?.trim() || "" });
        } catch (err: any) {
      console.error(err);
      const is503 = err.status === 503 || (err.message && err.message.includes("503"));
      res.status(400).json({ error: err.message || "Unknown error occurred" });
    }
  });

  app.post("/api/generate-enclosure", async (req, res) => {
    try {
      const dbApiKey = process.env.GEMINI_API_KEY;
      if (!dbApiKey) {
        return res
          .status(400)
          .json({ error: "Gemini API key is not configured on the server." });
      }
      const ai = new GoogleGenAI({
        apiKey: dbApiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });

      const { projectName, parts } = req.body;
      const partNames = parts?.map((p: any) => p.name).join(", ");

      const lastMessage = messages[messages.length - 1];
      const hasImage = !!lastMessage.imageBase64;
      const contentParts: any[] = [systemPrompt];
      if (hasImage && lastMessage.imageBase64) {
        contentParts.push({
          inlineData: {
            data: lastMessage.imageBase64.split(",")[1],
            mimeType: lastMessage.imageBase64.split(";")[0].split(":")[1]
          }
        });
      }

      const response = await fetchWithRetry(() => ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert industrial designer. Design a highly detailed, professional 3D enclosure for an electronics project.
Project Name: ${projectName || "Electronic Project"}
Components Included: ${partNames || "None"}

Please return ONLY a JSON object (no markdown, no backticks) with the following properties for the enclosure:
- width (number, in units, e.g. 5 to 20)
- height (number, in units, e.g. 1 to 10)
- depth (number, in units, e.g. 5 to 20)
- color (hex code string starting with #)
- material (string description, be creative and specific, e.g. "matte black anodized aluminum with acrylic panels")
- description (detailed paragraph explaining the design rationale, airflow, mounting, and aesthetics)`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              width: { type: Type.NUMBER },
              height: { type: Type.NUMBER },
              depth: { type: Type.NUMBER },
              color: { type: Type.STRING },
              material: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: [
              "width",
              "height",
              "depth",
              "color",
              "material",
              "description",
            ],
          },
        },
      }));


      const data = JSON.parse(response.text?.trim() || "{}");

      let imageUrl = null;
      try {
        const imagePrompt = `A high quality, photorealistic product photo of a finished electronic device prototype named "${projectName}". ${data.description}. The enclosure is made of ${data.material} and is colored ${data.color}. The design is sleek, modern, and fully assembled with all necessary components.`;
        
      const lastMessage = messages[messages.length - 1];
      const hasImage = !!lastMessage.imageBase64;
      const contentParts: any[] = [systemPrompt];
      if (hasImage && lastMessage.imageBase64) {
        contentParts.push({
          inlineData: {
            data: lastMessage.imageBase64.split(",")[1],
            mimeType: lastMessage.imageBase64.split(";")[0].split(":")[1]
          }
        });
      }

        const response = await fetchWithRetry(() => ai.models.generateContent({
          model: "gemini-3.1-flash-image",
          contents: { parts: [{ text: imagePrompt }] },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
              imageSize: "1K"
            }
          }
        }));

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || "image/png";
              imageUrl = `data:${mimeType};base64,${base64EncodeString}`;
              break;
            }
          }
        }
      } catch (err) {
        console.error("Error generating image:", err);
      }

      res.json({ ...data, imageUrl });
        } catch (err: any) {
      console.error(err);
      const is503 = err.status === 503 || (err.message && err.message.includes("503"));
      res.status(400).json({ error: err.message || "Unknown error occurred" });
    }
  });

  app.post("/api/circuit-review", async (req, res) => {
    try {
      const dbApiKey = process.env.GEMINI_API_KEY;
      if (!dbApiKey) {
        return res
          .status(400)
          .json({ error: "Gemini API key is not configured on the server." });
      }
      const ai = new GoogleGenAI({
        apiKey: dbApiKey,
        httpOptions: { headers: { "User-Agent": "aistudio-build" } },
      });
      const { circuit } = req.body;
      const lastMessage = messages[messages.length - 1];
      const hasImage = !!lastMessage.imageBase64;
      const contentParts: any[] = [systemPrompt];
      if (hasImage && lastMessage.imageBase64) {
        contentParts.push({
          inlineData: {
            data: lastMessage.imageBase64.split(",")[1],
            mimeType: lastMessage.imageBase64.split(";")[0].split(":")[1]
          }
        });
      }

      const response = await fetchWithRetry(() => ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `You are an expert electrical engineer. Review the following electronic circuit schematic. Analyze it for errors, missing connections, short circuits, incorrect polarities, and component value problems. Then provide a concise, professional Design Rule Check (DRC) report. 

Circuit Data (JSON format):
${JSON.stringify(circuit, null, 2)}`,
      }));
      res.json({ review: response.text?.trim() || "" });
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: { server } },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
