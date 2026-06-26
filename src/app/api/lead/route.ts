import { saveLead } from "@/lib/airtable";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false, error: "Neteisingas užklausos formatas." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return Response.json({ success: false, error: "Neteisingas užklausos formatas." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const vardas = typeof data.vardas === "string" ? data.vardas.trim() : "";
  const telefonas = typeof data.telefonas === "string" ? data.telefonas.trim() : "";

  if (!vardas || !telefonas) {
    return Response.json({ success: false, error: "Vardas ir telefonas yra privalomi." }, { status: 400 });
  }

  try {
    await saveLead({
      vardas,
      telefonas,
      email: typeof data.email === "string" ? data.email.trim() || undefined : undefined,
      paslauga: typeof data.paslauga === "string" ? data.paslauga.trim() || undefined : undefined,
      plotas: typeof data.plotas === "string" ? data.plotas.trim() || undefined : undefined,
      zinute: typeof data.zinute === "string" ? data.zinute.trim() || undefined : undefined,
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Nepavyko išsaugoti lead'o į Airtable:", error);
    return Response.json(
      { success: false, error: "Nepavyko išsaugoti užklausos. Bandykite vėliau arba paskambinkite tiesiogiai." },
      { status: 502 }
    );
  }
}
