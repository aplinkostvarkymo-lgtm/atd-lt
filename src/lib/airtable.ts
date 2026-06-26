const AIRTABLE_TABLE = "Leads";

export interface LeadInput {
  vardas: string;
  telefonas: string;
  email?: string;
  paslauga?: string;
  plotas?: string;
  zinute?: string;
}

export async function saveLead(lead: LeadInput): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error("Airtable konfigūracija nenustatyta (trūksta AIRTABLE_API_KEY arba AIRTABLE_BASE_ID).");
  }

  const fields: Record<string, string | number> = {
    "Vardas": lead.vardas,
    "Telefonas": lead.telefonas,
    "Šaltinis": "atd.lt - kontaktų forma",
    "Statusas": "Naujas",
    "Data": new Date().toISOString(),
  };

  if (lead.email) fields["Email"] = lead.email;
  if (lead.paslauga) fields["Paslauga"] = lead.paslauga;
  if (lead.zinute) fields["Žinutė"] = lead.zinute;
  if (lead.plotas) {
    const numericArea = Number(lead.plotas);
    fields["Plotas (m²)"] = Number.isFinite(numericArea) ? numericArea : lead.plotas;
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(AIRTABLE_TABLE)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields, typecast: true }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Airtable klaida (${response.status}): ${errorText}`);
  }
}
