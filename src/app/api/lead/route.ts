import { saveLead } from "@/lib/airtable";

const MAX_LENGTHS = {
  vardas: 100,
  telefonas: 30,
  email: 100,
  zinute: 2000,
} as const;

async function sendEmailNotification(data: {
  vardas: string;
  telefonas: string;
  email?: string;
  paslauga?: string;
  plotas?: string;
  zinute?: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // sąlyginis: jei raktų nėra, praleidžiame tyliai

  const lines = [
    `Vardas: ${data.vardas}`,
    `Telefonas: ${data.telefonas}`,
    data.email    ? `El. paštas: ${data.email}`    : null,
    data.paslauga ? `Paslauga: ${data.paslauga}`   : null,
    data.plotas   ? `Plotas: ${data.plotas} m²`    : null,
    data.zinute   ? `\nŽinutė:\n${data.zinute}`    : null,
  ].filter(Boolean).join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM ?? "ATD svetainė <noreply@atd.lt>",
      to: ["Robertas@atd.lt"],
      subject: `Nauja užklausa iš atd.lt — ${data.vardas}`,
      text: `Nauja užklausa iš atd.lt kontaktų formos:\n\n${lines}\n\n---\natd.lt`,
    }),
  });
}

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

  const leadData = {
    vardas,
    telefonas,
    email: email || undefined,
    paslauga: typeof data.paslauga === "string" ? data.paslauga.trim() || undefined : undefined,
    plotas: typeof data.plotas === "string" ? data.plotas.trim() || undefined : undefined,
    zinute: zinute || undefined,
  };

  try {
    await saveLead(leadData);
  } catch (error) {
    console.error("Nepavyko išsaugoti lead'o į Airtable:", error);
    return Response.json(
      { success: false, error: "Nepavyko išsaugoti užklausos. Bandykite vėliau arba paskambinkite tiesiogiai." },
      { status: 502 }
    );
  }

  // El. pašto klaida neblokuoja atsakymo vartotojui — praleidžiama tyliai
  sendEmailNotification(leadData).catch((err) =>
    console.error("El. pašto pranešimas nepavyko:", err)
  );

  return Response.json({ success: true });
}
