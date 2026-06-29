type FaqSource = Record<string, string>;

export function buildFaqSchema(source: FaqSource) {
  const mainEntity: {
    "@type": "Question";
    name: string;
    acceptedAnswer: { "@type": "Answer"; text: string };
  }[] = [];

  for (let i = 1; ; i++) {
    const q = source[`faq_q${i}`];
    const a = source[`faq_a${i}`];
    if (!q || !a) break;
    mainEntity.push({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
