import { saveLead } from "@/lib/airtable";

const MAX_LENGTHS = {
  vardas: 100,
  telefonas: 30,
  email: 100,
  zinute: 2000,
} as const;

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

  // Honeypot — žmogui nematomas laukas. Jei užpildytas, tai bot'as: apsimetame
  // sėkme (nepasiduodam, kad aptikti), bet NIEKADA nesiunčiame į Airtable.
  const honeypot = typeof data.company === "string" ? data.company.trim() : "";
  if (honeypot) {
    return Response.json({ success: true });
  }

  const vardas = typeof data.vardas === "string" ? data.vardas.trim() : "";
  const telefonas = typeof data.telefonas === "string" ? data.telefonas.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const zinute = typeof data.zinute === "string" ? data.zinute.trim() : "";

  if (!vardas || !telefonas) {
    return Response.json({ success: false, error: "Vardas ir telefonas yra privalomi." }, { status: 400 });
  }

  if (
    vardas.length > MAX_LENGTHS.vardas ||
    telefonas.length > MAX_LENGTHS.telefonas ||
    email.length > MAX_LENGTHS.email ||
    zinute.length > MAX_LENGTHS.zinute
  ) {
    return Response.json({ success: false, error: "Neteisingas užklausos formatas." }, { status: 400 });
  }

  try {
    await saveLead({
      vardas,
      telefonas,
      email: email || undefined,
      paslauga: typeof data.paslauga === "string" ? data.paslauga.trim() || undefined : undefined,
      plotas: typeof data.plotas === "string" ? data.plotas.trim() || undefined : undefined,
      zinute: zinute || undefined,
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
