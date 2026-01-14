import type { APIRoute } from "astro";
import { spawn } from "child_process";
import { existsSync } from "fs";
import path from "path";
import net from "net";

// Variable global per mantenir el procés actiu
let mlProcess: any = null;

// Funció per verificar si el port està en ús
async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once("error", () => resolve(true))
      .once("listening", () => {
        tester.close();
        resolve(false);
      })
      .listen(port, "127.0.0.1");
  });
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const PORT = 5000;
    const portInUse = await isPortInUse(PORT);

    if (portInUse) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "L'aplicació ML ja està executant-se",
          url: `http://localhost:${PORT}`,
          alreadyRunning: true,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Ruta a l'aplicació Python i al venv
    const mlPath = path.join(process.cwd(), "ML", "web", "app.py");
    const venvPython = path.join(process.cwd(), "ML", ".env", "Scripts", "python.exe");

    if (!existsSync(mlPath)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No s'ha trobat l'aplicació ML",
          path: mlPath,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!existsSync(venvPython)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No s'ha trobat el Python del venv. Executa: cd ML && python -m venv .env",
          path: venvPython,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Executar l'aplicació Python amb el venv
    mlProcess = spawn(venvPython, [mlPath], {
      cwd: path.join(process.cwd(), "ML", "web"),
      detached: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let startupOutput = "";
    let hasStarted = false;

    // Capturar la sortida per detectar quan està llest
    mlProcess.stdout?.on("data", (data: Buffer) => {
      startupOutput += data.toString();
      console.log(`ML stdout: ${data}`);
      
      // Detectar quan Flask està llest
      if (data.toString().includes("Running on") || data.toString().includes("WARNING")) {
        hasStarted = true;
      }
    });

    mlProcess.stderr?.on("data", (data: Buffer) => {
      console.error(`ML stderr: ${data}`);
    });

    mlProcess.on("error", (error: Error) => {
      console.error("Error executant ML:", error);
    });

    mlProcess.on("close", (code: number) => {
      console.log(`Procés ML tancat amb codi: ${code}`);
      mlProcess = null;
    });

    // Esperar que l'aplicació s'iniciï (màxim 10 segons)
    await new Promise((resolve) => {
      let attempts = 0;
      const checkInterval = setInterval(() => {
        attempts++;
        if (hasStarted || attempts > 20) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 500);
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Aplicació ML iniciada correctament",
        url: `http://localhost:${PORT}`,
        alreadyRunning: false,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error a ml-launch:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Error desconegut",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
