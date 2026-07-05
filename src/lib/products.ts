// ===========================================================
// Khaleej Peptides — Product Catalog data
// Prices are stored in AED.
// ===========================================================

export type Focus =
  | "weightloss"
  | "growth"
  | "recovery"
  | "antiaging"
  | "wellness";

export const FOCUS_META: Record<
  Focus,
  { title: string; short: string; cap: string; blurb: string }
> = {
  weightloss: {
    title: "Weight Loss & Metabolic",
    short: "Weight Loss",
    cap: "var(--color-cap-gold)",
    blurb: "GLP-1 class & metabolic peptides for appetite, fat loss & body composition.",
  },
  growth: {
    title: "Growth & Performance",
    short: "Growth & Performance",
    cap: "var(--color-cap-lavender)",
    blurb: "GH-axis secretagogues & growth factors for muscle, output & recovery.",
  },
  recovery: {
    title: "Healing & Recovery",
    short: "Healing & Recovery",
    cap: "var(--color-cap-mint)",
    blurb: "Tissue, joint, gut & skin repair and regeneration compounds.",
  },
  antiaging: {
    title: "Anti-Aging & Longevity",
    short: "Longevity",
    cap: "var(--color-cap-rose)",
    blurb: "Cellular energy, mitochondrial support & healthy-aging peptides.",
  },
  wellness: {
    title: "Cognitive & Wellness",
    short: "Cognitive & Wellness",
    cap: "var(--color-cap-peach)",
    blurb: "Nootropic, sleep, libido & hormonal-balance peptides.",
  },
};

export type Form = "pen" | "vial";

export interface Variant {
  /** Display label e.g. "20 mg" or "30 mg + 5 mg" */
  label: string;
  /** total mg for sorting / syringe calc hint */
  mg: number;
  price: number; // AED
  /** optional real product photo for this dose (path under /public). Falls back to vector pen if missing. */
  image?: string;
}

export interface Molecular {
  sequence?: string;
  formula?: string;
  weight?: string;
  cas?: string;
}

export interface Product {
  id: string;
  name: string;
  /** subtitle / blend breakdown */
  subtitle?: string;
  form: Form;
  focus: Focus[];
  cap: string; // css color for cap indicator
  /** one-line summary */
  summary: string;
  /** longer description */
  description: string;
  /** treatment goals / tags used by filters */
  goals: string[];
  variants: Variant[];
  molecular: Molecular;
  purity: string;
  featured?: boolean;
  /** optional real product photos (paths under /public). Falls back to vector pen if absent/missing. */
  images?: string[];
}

const CAP = {
  gold: "var(--color-cap-gold)",       // Weight Loss
  navy: "var(--color-cap-lavender)",   // Growth
  bronze: "var(--color-cap-mint)",     // Recovery
  champagne: "var(--color-cap-rose)",  // Longevity
  slate: "var(--color-cap-peach)",     // Wellness
} as const;

export const PRODUCTS: Product[] = [
  // ========================= INJECTION PENS =========================
  {
    id: "retatrutide",
    name: "Retatrutide",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Triple-agonist (GLP-1 / GIP / Glucagon) metabolic peptide.",
    description:
      "Retatrutide is a triple-receptor agonist acting on GLP-1, GIP and glucagon pathways — the most advanced compound available for metabolic support and the most potent in its class. Used in metabolic protocols for appetite signalling, energy expenditure and body composition.\n\nTypical Course: A full course runs 12 weeks. It begins with a 2-week loading phase at a low dose (0.5mg weekly) to assess tolerance, followed by a 4-week escalation phase (1–2mg weekly) with gradual increases, then a 6-week maintenance phase at the target dose (4mg weekly). Most users notice initial effects around week 2, with results peaking around week 10.\n\nWhat to Expect: Appetite reduction, a shift in body composition, improved metabolic rate and changes in energy levels. Key benefits include best-in-class GLP-1-class potency, triple-receptor action, significant body composition effects and once-weekly administration.\n\nConsiderations & Safety: Nausea is common during the first few weeks as the dose is gradually increased, and constipation is also possible. Common side effects include nausea, reduced appetite, injection site reactions, fatigue and constipation. Seek medical advice immediately if you experience severe persistent vomiting, signs of pancreatitis (upper-left abdominal pain), a rapid heart rate above 100bpm, or any allergic reaction.",
    goals: ["Fat Loss", "Metabolic", "Appetite Signalling"],
    variants: [
      { label: "10 mg", mg: 10, price: 650, image: "/products/retatrutide-10mg.png" },
      { label: "20 mg", mg: 20, price: 900, image: "/products/retatrutide-20mg.png" },
      { label: "30 mg", mg: 30, price: 1050, image: "/products/retatrutide-30mg.png" },
      { label: "40 mg", mg: 40, price: 1300, image: "/products/retatrutide-40mg.png" },
      { label: "60 mg", mg: 60, price: 1600, image: "/products/retatrutide-60mg.png" },
    ],
    molecular: { formula: "C221H342N46O68", weight: "4731.3 g/mol", cas: "2381089-83-2" },
    purity: "99.4%",
    featured: true,
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Dual GLP-1 / GIP agonist for metabolic support.",
    description:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist used extensively in glucose-regulation and body-composition protocols — a clinically studied, leading compound for incretin-pathway support.\n\nTypical Course: A full course runs 12 weeks. It begins with a 4-week loading phase at 2.5mg weekly, followed by a 4-week escalation phase at 5mg weekly once the starting dose is well tolerated, then a 4-week maintenance phase at 10mg weekly. Most users notice initial effects around week 2, with results peaking around week 8.\n\nWhat to Expect: Appetite suppression, improved glucose regulation, body weight reduction and energy stabilisation. Key benefits include the dual GLP-1/GIP mechanism, an excellent tolerability profile, a well-studied compound profile and a consistent dose-escalation schedule.\n\nConsiderations & Safety: Nausea is common in the first few weeks as the dose is increased; constipation and injection site reactions are also possible. Common side effects include nausea, vomiting, diarrhoea, constipation and decreased appetite. Seek medical advice immediately if you experience severe abdominal pain, persistent vomiting, an allergic reaction, or significant vision changes.",
    goals: ["Fat Loss", "Metabolic", "Glucose Regulation"],
    variants: [
      { label: "10 mg", mg: 10, price: 650, image: "/products/tirzepatide-10mg.png" },
      { label: "20 mg", mg: 20, price: 900, image: "/products/tirzepatide-20mg.png" },
      { label: "30 mg", mg: 30, price: 1050, image: "/products/tirzepatide-30mg.png" },
      { label: "40 mg", mg: 40, price: 1300, image: "/products/tirzepatide-40mg.png" },
      { label: "60 mg", mg: 60, price: 1600, image: "/products/tirzepatide-60mg.png" },
    ],
    molecular: { formula: "C225H348N48O68", weight: "4813.5 g/mol", cas: "2023788-19-2" },
    purity: "99.8%",
    featured: true,
  },
  {
    id: "retatrutide-cagrilintide",
    name: "Retatrutide + Cagrilintide",
    subtitle: "Triple agonist + amylin analogue blend",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Combined incretin + amylin pathway blend.",
    description:
      "A blend pairing Retatrutide's triple-agonist activity with Cagrilintide, a long-acting amylin analogue. Used together for additive effects on satiety signalling and metabolic rate.",
    goals: ["Fat Loss", "Metabolic", "Satiety"],
    variants: [
      { label: "30 mg + 5 mg", mg: 35, price: 1100, image: "/products/retatrutide-cagrilintide-30mg-5mg.png" },
      { label: "40 mg + 10 mg", mg: 50, price: 1600, image: "/products/retatrutide-cagrilintide-40mg-10mg.png" },
    ],
    molecular: { cas: "2381089-83-2 / 1415456-99-3" },
    purity: "99%+",
  },
  {
    id: "cjc-ipamorelin",
    name: "CJC-1295 No DAC + Ipamorelin",
    subtitle: "GHRH analogue + GH secretagogue blend",
    form: "pen",
    focus: ["growth", "recovery"],
    cap: CAP.navy,
    summary: "Synergistic growth-hormone secretagogue blend.",
    description:
      "Pairs CJC-1295 (No DAC), a GHRH analogue, with Ipamorelin, a selective GH secretagogue — a gold-standard GH-stimulating combination for body composition support. Together they promote amplified, pulsatile GH release for recovery, body composition and sleep quality.\n\nTypical Course: A full course runs 12 weeks. It begins with a 2-week assessment phase at a lower dose (100mcg of each peptide, once daily before bed) to monitor sleep-quality changes, followed by a 10-week protocol at 100–300mcg of each peptide, dosed once or twice daily — typically morning and evening — for maximum GH pulse. Most users notice initial effects around week 3, with results peaking around week 8.\n\nWhat to Expect: Improved sleep quality, faster recovery, leaner body composition and improved skin and hair quality. Key benefits include synergistic GH stimulation, twice-daily dosing flexibility, good tolerability and improved sleep quality.\n\nConsiderations & Safety: This combination involves more frequent dosing, and water retention or carpal-tunnel-like tingling are possible; effects are generally less pronounced than exogenous GH. Common side effects include brief flushing (from Ipamorelin), water retention, headache and tingling in the extremities. Seek medical advice immediately if you experience significant swelling, signs of infection, severe headache, or chest pain.",
    goals: ["Muscle Growth", "Recovery", "GH Secretion", "Sleep"],
    variants: [
      { label: "10 mg (5+5)", mg: 10, price: 800, image: "/products/cjc-ipamorelin-10mg.png" },
      { label: "20 mg (10+10)", mg: 20, price: 1050, image: "/products/cjc-ipamorelin-20mg.png" },
      { label: "40 mg (20+20)", mg: 40, price: 1500, image: "/products/cjc-ipamorelin-40mg.png" },
    ],
    molecular: { cas: "863288-34-0 / 170851-70-4" },
    purity: "99%+",
    featured: true,
  },
  {
    id: "cjc-1295",
    name: "CJC-1295 No DAC",
    subtitle: "Modified GRF (1-29)",
    form: "pen",
    focus: ["growth"],
    cap: CAP.navy,
    summary: "GHRH analogue for pulsatile GH-release support.",
    description:
      "CJC-1295 without DAC (Modified GRF 1-29) is a growth-hormone-releasing-hormone analogue with a short half-life, valued for its sharp, pulsatile stimulation of endogenous GH secretion.",
    goals: ["Muscle Growth", "Recovery", "GH Secretion"],
    variants: [
      { label: "10 mg", mg: 10, price: 750, image: "/products/cjc-1295-10mg.png" },
      { label: "20 mg", mg: 20, price: 1050, image: "/products/cjc-1295-20mg.png" },
    ],
    molecular: { formula: "C152H252N44O42", weight: "3367.9 g/mol", cas: "863288-34-0" },
    purity: "99%+",
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    form: "pen",
    focus: ["growth"],
    cap: CAP.navy,
    summary: "Selective growth-hormone secretagogue.",
    description:
      "Ipamorelin is a selective ghrelin-receptor agonist and GH secretagogue. Valued for stimulating GH release with minimal impact on cortisol or prolactin.",
    goals: ["Muscle Growth", "Recovery", "GH Secretion"],
    variants: [
      { label: "10 mg", mg: 10, price: 750, image: "/products/ipamorelin-10mg.png" },
      { label: "20 mg", mg: 20, price: 1050, image: "/products/ipamorelin-20mg.png" },
      { label: "30 mg", mg: 30, price: 1500, image: "/products/ipamorelin-30mg.png" },
    ],
    molecular: { sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH2", formula: "C38H49N9O5", weight: "711.85 g/mol", cas: "170851-70-4" },
    purity: "99%+",
  },
  {
    id: "tesamorelin",
    name: "Tesamorelin",
    form: "pen",
    focus: ["weightloss", "growth"],
    cap: CAP.gold,
    summary: "GHRH analogue used for visceral-fat support.",
    description:
      "Tesamorelin is a stabilised GHRH analogue — one of the most studied GHRH compounds — used specifically for its effect on visceral adipose tissue, alongside strength and lean-mass preservation in metabolic protocols.\n\nTypical Course: A full course runs 12 weeks at a consistent daily dose (2mg, administered at the same time each day) — consistency is critical for results. Most users notice initial effects around week 4, with results continuing to build through week 12.\n\nWhat to Expect: Visceral fat reduction, GH-axis stimulation, lean mass preservation and improved cognitive clarity. Key benefits include a simple once-daily protocol, targeted visceral fat effects, no IGF-1 axis suppression and good overall tolerability.\n\nConsiderations & Safety: Requires daily administration, and results tend to plateau by week 12; joint stiffness and water retention are possible. Common side effects include injection site reactions, joint pain, water retention and carpal-tunnel-like tingling. Seek medical advice immediately if you experience severe joint swelling, significant oedema, signs of glucose intolerance, or a spreading injection site reaction.",
    goals: ["Visceral Fat", "Metabolic", "GH Secretion"],
    variants: [
      { label: "20 mg", mg: 20, price: 1050, image: "/products/tesamorelin-20mg.png" },
      { label: "40 mg", mg: 40, price: 1600, image: "/products/tesamorelin-40mg.png" },
    ],
    molecular: { formula: "C221H366N72O67S", weight: "5135.9 g/mol", cas: "218949-48-5" },
    purity: "99.6%",
  },
  {
    id: "aod-9604",
    name: "AOD-9604",
    subtitle: "hGH fragment 176-191",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Modified growth-hormone fragment for lipolysis support.",
    description:
      "AOD-9604 is a modified fragment of the C-terminus of human growth hormone (176-191) — valued for targeted lipolysis support without IGF-1 axis interference and without effect on blood glucose or growth.\n\nTypical Course: A full course runs 12 weeks at a consistent dose (300mcg) once daily on an empty stomach, ideally around 30 minutes before food for optimal effect. Most users notice initial effects around week 4, with results peaking around week 10.\n\nWhat to Expect: Stimulated lipolysis, supported fat metabolism, no IGF-1 interference and changes in energy levels. Key benefits include no effect on the IGF-1 axis, a fat-specific mechanism, once-daily dosing and a good safety profile.\n\nConsiderations & Safety: Visible results take longer to appear (around 4 weeks), dosing must be on an empty stomach, and the effect is milder than full growth hormone or newer compounds. Common side effects include injection site redness, mild headache, fatigue and rare nausea. Seek medical advice immediately if you notice unusual swelling beyond the application site, severe allergic reaction, or chest tightness.",
    goals: ["Fat Loss", "Metabolic", "Lipolysis"],
    variants: [
      { label: "10 mg", mg: 10, price: 900, image: "/products/aod-9604-10mg.png" },
      { label: "20 mg", mg: 20, price: 1450, image: "/products/aod-9604-20mg.png" },
      { label: "30 mg", mg: 30, price: 2000, image: "/products/aod-9604-30mg.png" },
    ],
    molecular: { formula: "C78H123N23O23S2", weight: "1815.1 g/mol", cas: "221231-10-3" },
    purity: "99%+",
  },
  {
    id: "igf-1-lr3",
    name: "IGF-1 LR3",
    subtitle: "Long R3 Insulin-like Growth Factor-1",
    form: "pen",
    focus: ["growth"],
    cap: CAP.navy,
    summary: "Long-acting IGF-1 analogue for growth support.",
    description:
      "IGF-1 LR3 is an 83-amino-acid analogue of insulin-like growth factor-1 with an extended half-life. Used for cellular proliferation, hypertrophy and nutrient-partitioning support.",
    goals: ["Muscle Growth", "Cellular Proliferation"],
    variants: [{ label: "1 mg", mg: 1, price: 1200, image: "/products/igf-1-lr3-1mg.png" }],
    molecular: { formula: "C400H625N111O115S9", weight: "9117.6 g/mol", cas: "946870-92-4" },
    purity: "99%+",
  },
  {
    id: "klow",
    name: "KLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500 + KPV",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Quad-blend regeneration & skin-repair stack.",
    description:
      "KLOW combines GHK-Cu, BPC-157, TB-500 and KPV into a single regenerative blend — the most comprehensive regeneration option available — used across skin remodelling, systemic tissue repair and inflammatory signalling.\n\nTypical Course: A full course runs 12 weeks. It begins with a 2-week phase at a lower dose (2mg once daily) to assess individual tolerance to the blend, followed by a 10-week phase at 4mg once daily in the morning, when systemic activity is optimal. Most users notice initial effects around week 2, with results peaking around week 8.\n\nWhat to Expect: Faster recovery, improved skin and collagen quality, reduced inflammation and improved overall tissue health. Key benefits include four compounds in a single formulation, comprehensive regeneration, convenient once-daily administration and synergistic compound action.\n\nConsiderations & Safety: Because this is a multi-compound blend, individual compound effects cannot be isolated, and sensitivity to one of the components is possible. Common side effects include injection site redness, mild nausea, headache and temporary fatigue. Seek medical advice immediately if you notice signs of infection, severe allergic reaction, persistent worsening symptoms, or high fever.",
    goals: ["Recovery", "Skin", "Anti-Inflammatory", "Healing"],
    variants: [{ label: "80 mg", mg: 80, price: 1150, image: "/products/klow-80mg.png" }],
    molecular: {},
    purity: "99%+",
    featured: true,
  },
  {
    id: "glow",
    name: "GLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Skin, healing & recovery tri-blend.",
    description:
      "GLOW is a tri-blend of GHK-Cu, BPC-157 and TB-500 used for combined skin-quality, wound-healing and systemic recovery effects.",
    goals: ["Recovery", "Skin", "Healing"],
    variants: [{ label: "70 mg", mg: 70, price: 1050, image: "/products/glow-70mg.png" }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    subtitle: "Copper Tripeptide-1",
    form: "pen",
    focus: ["recovery", "antiaging"],
    cap: CAP.bronze,
    summary: "Copper peptide for skin, hair & wound-healing support.",
    description:
      "GHK-Cu (Glycine-Histidine-Lysine Copper peptide) is a naturally occurring copper-binding tripeptide — a gold-standard compound for collagen synthesis and skin regeneration — valued for skin remodelling, hair-follicle activity and wound-repair signalling.\n\nTypical Course: A full course runs 12 weeks at a consistent daily dose (1–2mg once daily). A mild blue-green tint at the application site is a normal, expected part of treatment due to the compound's copper content. Most users notice initial effects around week 4, with results peaking around week 10.\n\nWhat to Expect: Improved skin texture, increased collagen density, better hair quality and improved wound healing. Key benefits include a skin- and collagen-specific mechanism, flexibility for topical or injectable application, good tolerability and anti-inflammatory properties.\n\nConsiderations & Safety: Visible results take around 4 weeks to appear, results vary by individual, and consistent daily treatment is required. Common side effects include the expected blue-green tint at the application site, mild flushing, rare headache and temporary site irritation. Seek medical advice immediately if you experience a severe skin reaction, signs of copper sensitivity (nausea or jaundice), anaphylaxis, or a spreading infection.",
    goals: ["Skin", "Hair", "Healing", "Anti-Aging"],
    variants: [
      { label: "50 mg", mg: 50, price: 650, image: "/products/ghk-cu-50mg.png" },
      { label: "100 mg", mg: 100, price: 750, image: "/products/ghk-cu-100mg.png" },
    ],
    molecular: { sequence: "Gly-His-Lys (Cu²⁺)", formula: "C14H24N6O4·Cu", weight: "403.9 g/mol", cas: "49557-75-7" },
    purity: "99.8%",
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    subtitle: "Body Protection Compound-157",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Versatile tissue-repair & gut-health peptide.",
    description:
      "BPC-157 (Body Protection Compound) is a synthetic pentadecapeptide derived from a gastric protective protein — one of the most widely used and well-studied compounds for gut, tendon, ligament and tissue healing.\n\nTypical Course: A full course runs 12 weeks. It typically begins with a 4-week phase at a higher dose (500mcg twice daily, morning and evening) targeted close to the area of concern, followed by an 8-week phase at 250mcg once daily for ongoing tissue support. Most users notice initial effects within the first week, with results peaking around week 4.\n\nWhat to Expect: Faster recovery, gut healing, tendon and ligament repair, and reduced inflammation. Key benefits include an extremely fast onset, combined gut and systemic healing, an excellent safety profile and versatile application sites.\n\nConsiderations & Safety: The initial phase involves twice-daily dosing, human data remains limited, and vivid dreams are possible. Common side effects include mild nausea (rare), injection site redness, vivid dreams and temporary dizziness. Seek medical advice immediately if you notice a spreading injection site reaction, severe allergic reaction, severe abdominal pain, or high fever.",
    goals: ["Recovery", "Healing", "Gut Health", "Joint"],
    variants: [{ label: "10 mg", mg: 10, price: 700, image: "/products/bpc-157-10mg.png" }],
    molecular: { sequence: "GEPPPGKPADDAGLV", formula: "C62H98N16O22", weight: "1419.5 g/mol", cas: "137525-51-0" },
    purity: "99.3%",
    featured: true,
  },
  {
    id: "nad-plus",
    name: "NAD+",
    subtitle: "Nicotinamide Adenine Dinucleotide",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Coenzyme used for cellular energy & longevity.",
    description:
      "NAD+ (Nicotinamide Adenine Dinucleotide) is an essential coenzyme central to mitochondrial energy production and DNA-repair pathways — a cornerstone compound for cellular-aging, metabolic and longevity protocols.\n\nTypical Course: A typical cycle runs 4 weeks on, 4 weeks off. It begins with a 1-week phase at a lower dose administered slowly (50mg, via IV or injection), followed by a 3-week phase at 100–500mg, given daily or every other day. Most users notice initial effects within the first week, with results peaking around week 4.\n\nWhat to Expect: Improved cellular energy, mental clarity, enhanced recovery and better sleep quality. Key benefits include immediate energy effects, activation of DNA-repair pathways, broad systemic benefits and strong research backing.\n\nConsiderations & Safety: Flushing is very common during IV administration, which is why it is given slowly. Common side effects include flushing and warmth (very common with IV), chest pressure during infusion, nausea, headache and muscle cramps. Seek medical advice immediately if you experience severe chest pain that does not resolve when the infusion is slowed, difficulty breathing, severe allergic reaction, or irregular heartbeat.",
    goals: ["Longevity", "Energy", "Cellular Repair", "Anti-Aging"],
    variants: [
      { label: "500 mg", mg: 500, price: 950, image: "/products/nad-plus-500mg.png" },
      { label: "1000 mg", mg: 1000, price: 1400, image: "/products/nad-plus-1000mg.png" },
    ],
    molecular: { formula: "C21H27N7O14P2", weight: "663.43 g/mol", cas: "53-84-9" },
    purity: "99%+",
  },
  {
    id: "wolverine",
    name: "Wolverine Stack",
    subtitle: "BPC-157 + TB-500",
    form: "pen",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Dual healing stack for accelerated repair support.",
    description:
      "The Wolverine Stack pairs BPC-157 with TB-500, combining localised and systemic repair mechanisms. A leading combination for connective-tissue and injury recovery.",
    goals: ["Recovery", "Healing", "Joint", "Muscle Growth"],
    variants: [
      { label: "10 mg", mg: 10, price: 850, image: "/products/wolverine-10mg.png" },
      { label: "20 mg", mg: 20, price: 1000, image: "/products/wolverine-20mg.png" },
    ],
    molecular: { cas: "137525-51-0 / 77591-33-4" },
    purity: "99%+",
  },
  {
    id: "pt-141",
    name: "PT-141",
    subtitle: "Bremelanotide",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Melanocortin agonist for libido & arousal support.",
    description:
      "PT-141 (Bremelanotide) is a melanocortin-receptor agonist acting centrally on arousal pathways — a unique, non-vascular mechanism used to support sexual function for both men and women.\n\nTypical Course: Administered on an as-needed basis (1–2mg), timed 45 minutes to 2 hours before activity, with a maximum of one dose per 24 hours and no more than twice per week. Most users notice effects within 45–90 minutes of administration.\n\nWhat to Expect: Activation of arousal pathways, a fast response onset, a defined duration of effect and mood elevation. Key benefits include a central mechanism that works differently to PDE5 inhibitors, no cardiovascular mechanism, applicability across multiple use cases and fast onset of 45–90 minutes.\n\nConsiderations & Safety: Nausea is very common on first use, blood pressure elevation is transient, and frequency should not exceed twice weekly. Common side effects include nausea (especially on first use), facial flushing, headache and transient blood pressure elevation. Seek medical advice immediately if you experience severe nausea or vomiting, significant blood pressure elevation with severe headache, effects lasting more than 4 hours, or severe allergic reaction.",
    goals: ["Libido", "Wellness"],
    variants: [
      { label: "10 mg", mg: 10, price: 900, image: "/products/pt-141-10mg.png" },
      { label: "40 mg", mg: 40, price: 1400, image: "/products/pt-141-40mg.png" },
    ],
    molecular: { sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH", formula: "C50H68N14O10", weight: "1025.2 g/mol", cas: "189691-06-3" },
    purity: "99%+",
  },
  {
    id: "kisspeptin",
    name: "Kisspeptin-10",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Hypothalamic peptide for hormonal-axis support.",
    description:
      "Kisspeptin-10 is a key upstream regulator of the reproductive hormonal axis, stimulating GnRH release. Used to support LH/FSH signalling, fertility and hormonal health.",
    goals: ["Hormonal Balance", "Fertility", "Wellness"],
    variants: [
      { label: "10 mg", mg: 10, price: 850, image: "/products/kisspeptin-10mg.png" },
      { label: "20 mg", mg: 20, price: 1300, image: "/products/kisspeptin-20mg.png" },
    ],
    molecular: { sequence: "YNWNSFGLRF-NH2", formula: "C63H83N17O14", weight: "1302.4 g/mol", cas: "374675-21-5" },
    purity: "99%+",
  },
  {
    id: "slu-pp-223",
    name: "SLU-PP-223",
    subtitle: "ERR pan-agonist",
    form: "pen",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Estrogen-related-receptor agonist for metabolic support.",
    description:
      "SLU-PP-223 is an estrogen-related-receptor (ERR) pan-agonist valued for its ability to upregulate mitochondrial biogenesis and energy expenditure — an 'exercise-mimetic' compound.",
    goals: ["Metabolic", "Energy", "Fat Loss"],
    variants: [{ label: "10 mg", mg: 10, price: 950, image: "/products/slu-pp-223-10mg.png" }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "ss-31",
    name: "SS-31",
    subtitle: "Elamipretide",
    form: "pen",
    focus: ["antiaging"],
    cap: CAP.champagne,
    summary: "Mitochondria-targeted peptide for cellular anti-aging.",
    description:
      "SS-31 (Elamipretide) is a mitochondria-targeted tetrapeptide that stabilises cardiolipin on the inner mitochondrial membrane. Used to support cellular energetics, oxidative-stress protection and healthy aging.",
    goals: ["Longevity", "Anti-Aging", "Energy", "Cellular Repair"],
    variants: [
      { label: "20 mg", mg: 20, price: 750, image: "/products/ss-31-20mg.png" },
      { label: "50 mg", mg: 50, price: 1100, image: "/products/ss-31-50mg.png" },
    ],
    molecular: { sequence: "D-Arg-2,6-dimethylTyr-Lys-Phe-NH2", formula: "C32H49N9O5", weight: "639.8 g/mol", cas: "736992-21-5" },
    purity: "99%+",
  },
  {
    id: "mots-c",
    name: "MOTS-C",
    subtitle: "Mitochondrial-derived peptide",
    form: "pen",
    focus: ["antiaging", "weightloss"],
    cap: CAP.champagne,
    summary: "Mitochondrial peptide for energy & metabolic support.",
    description:
      "MOTS-C is a mitochondrial-derived peptide — a next-generation metabolic regulator originating from the mitochondrial genome — valued for its role in metabolic homeostasis, insulin sensitivity and cellular energy regulation, making it a key compound for healthy aging.\n\nTypical Course: A full course runs 12 weeks at a consistent dose (5–10mg) once daily in the morning, ideally before exercise on an empty stomach for metabolic effect. Most users notice initial effects around week 3, with results peaking around week 8.\n\nWhat to Expect: Improved metabolic rate, better insulin sensitivity, enhanced exercise performance and improved longevity markers. Key benefits include a novel mitochondrial origin, dual metabolic and performance benefits, strong longevity research interest and a simple once-daily morning dose.\n\nConsiderations & Safety: This is a relatively newer compound with less long-term data than other peptides, and blood glucose changes — including a risk of hypoglycaemia — are possible. Common side effects include injection site redness, post-administration fatigue, rare headache and blood glucose fluctuation. Seek medical advice immediately if you experience symptoms of hypoglycaemia (shakiness, sweating, confusion), signs of infection, or a severe systemic reaction.",
    goals: ["Metabolic", "Energy", "Longevity", "Insulin Sensitivity"],
    variants: [
      { label: "20 mg", mg: 20, price: 800, image: "/products/mots-c-20mg.png" },
      { label: "40 mg", mg: 40, price: 1100, image: "/products/mots-c-40mg.png" },
    ],
    molecular: { sequence: "MRWQEMGYIFYPRKLR", formula: "C101H152N28O22S2", weight: "2174.6 g/mol", cas: "1627580-64-6" },
    purity: "99.9%",
    featured: true,
  },
  {
    id: "selank",
    name: "Selank",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Anxiolytic nootropic peptide.",
    description:
      "Selank is a synthetic anxiolytic heptapeptide analogue of tuftsin — a GABA-modulating neuropeptide valued for stress resilience and cognitive clarity — used for its anxiolytic and nootropic effects.\n\nTypical Course: A typical cycle runs 4 weeks on, 2 weeks off, at 250–300mcg given 1–3 times daily (intranasally or by injection, typically morning and afternoon). Most users notice initial effects within the first week, with results peaking around week 3.\n\nWhat to Expect: Improved stress resilience, cognitive clarity, reduced anxiety and better sleep quality. Key benefits include fast onset via the intranasal route, a flexible administration route, a low side-effect profile and combined cognitive and mood benefits.\n\nConsiderations & Safety: The cycle length is short, nasal irritation is possible with intranasal use, and some users experience drowsiness. Common side effects include mild sedation or drowsiness, nasal irritation (intranasal use), headache and mild fatigue. Seek medical advice immediately if you experience severe sedation, severe allergic reaction, or significant mood or psychological changes.",
    goals: ["Cognition", "Wellness", "Mood"],
    variants: [{ label: "10 mg", mg: 10, price: 950, image: "/products/selank-10mg.png" }],
    molecular: { sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro", formula: "C33H57N11O9", weight: "751.9 g/mol", cas: "129954-34-3" },
    purity: "99%+",
  },
  {
    id: "dsip",
    name: "DSIP",
    subtitle: "Delta Sleep-Inducing Peptide",
    form: "pen",
    focus: ["wellness", "recovery"],
    cap: CAP.slate,
    summary: "Neuropeptide used to support sleep architecture.",
    description:
      "DSIP is a naturally occurring neuropeptide used to support slow-wave sleep, stress-response modulation and circadian recovery.",
    goals: ["Sleep", "Recovery", "Wellness"],
    variants: [{ label: "10 mg", mg: 10, price: 950, image: "/products/dsip-10mg.png" }],
    molecular: { sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu", formula: "C35H48N10O15", weight: "848.8 g/mol", cas: "62568-57-4" },
    purity: "99%+",
  },
  {
    id: "semax",
    name: "Semax",
    form: "pen",
    focus: ["wellness"],
    cap: CAP.slate,
    summary: "Nootropic & neuroprotective peptide.",
    description:
      "Semax is an ACTH (4-10) analogue used for nootropic, neuroprotective and BDNF-modulating effects supporting cognitive performance.",
    goals: ["Cognition", "Wellness", "Neuroprotection"],
    variants: [{ label: "10 mg", mg: 10, price: 950, image: "/products/semax-10mg.png" }],
    molecular: { sequence: "Met-Glu-His-Phe-Pro-Gly-Pro", formula: "C37H51N9O10S", weight: "813.9 g/mol", cas: "80714-61-0" },
    purity: "99%+",
  },

  // ============================== VIALS ==============================
  {
    id: "retatrutide-vial",
    name: "Retatrutide",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["weightloss"],
    cap: CAP.gold,
    summary: "Triple-agonist metabolic peptide in lyophilised vial form.",
    description:
      "Retatrutide in lyophilised vial form — a triple-receptor agonist (GLP-1 / GIP / glucagon) for appetite signalling, energy expenditure and body composition. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Fat Loss", "Metabolic", "Appetite Signalling"],
    variants: [
      { label: "60 mg", mg: 60, price: 1200, image: "/products/retatrutide-vial-60mg.png" },
    ],
    molecular: { formula: "C221H342N46O68", weight: "4731.3 g/mol", cas: "2381089-83-2" },
    purity: "99.4%",
  },
  {
    id: "tesamorelin-vial",
    name: "Tesamorelin",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["weightloss", "growth"],
    cap: CAP.gold,
    summary: "GHRH analogue for visceral-fat support, vial form.",
    description:
      "Tesamorelin in lyophilised vial form — a stabilised GHRH analogue used for its effect on visceral adipose tissue alongside lean-mass preservation. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Visceral Fat", "Metabolic", "GH Secretion"],
    variants: [{ label: "20 mg", mg: 20, price: 800, image: "/products/tesamorelin-vial-20mg.png" }],
    molecular: { formula: "C221H366N72O67S", weight: "5135.9 g/mol", cas: "218949-48-5" },
    purity: "99.6%",
  },
  {
    id: "cjc-ipamorelin-vial",
    name: "CJC-1295 + Ipamorelin Blend",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["growth", "recovery"],
    cap: CAP.navy,
    summary: "GH secretagogue blend in lyophilised vial form.",
    description:
      "CJC-1295 (No DAC) + Ipamorelin blend in lyophilised vial form — a gold-standard GH-stimulating combination for recovery, body composition and sleep quality. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Muscle Growth", "Recovery", "GH Secretion", "Sleep"],
    variants: [{ label: "20 mg", mg: 20, price: 800, image: "/products/cjc-ipamorelin-vial-20mg.png" }],
    molecular: { cas: "863288-34-0 / 170851-70-4" },
    purity: "99%+",
  },
  {
    id: "mots-c-vial",
    name: "MOTS-C",
    subtitle: "Lyophilised powder — vial",
    form: "vial",
    focus: ["antiaging", "weightloss"],
    cap: CAP.champagne,
    summary: "Mitochondrial peptide in lyophilised vial form.",
    description:
      "MOTS-C in lyophilised vial form — a mitochondrial-derived peptide supporting metabolic homeostasis, insulin sensitivity and cellular energy. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Metabolic", "Energy", "Longevity", "Insulin Sensitivity"],
    variants: [{ label: "40 mg", mg: 40, price: 800, image: "/products/mots-c-vial-40mg.png" }],
    molecular: { sequence: "MRWQEMGYIFYPRKLR", formula: "C101H152N28O22S2", weight: "2174.6 g/mol", cas: "1627580-64-6" },
    purity: "99.9%",
  },
  {
    id: "ghk-cu-vial",
    name: "GHK-Cu",
    subtitle: "Copper Tripeptide-1 — vial",
    form: "vial",
    focus: ["recovery", "antiaging"],
    cap: CAP.bronze,
    summary: "Copper peptide for skin & wound healing, vial form.",
    description:
      "GHK-Cu in lyophilised vial form — a copper-binding tripeptide for collagen synthesis, skin regeneration and wound-repair signalling. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Skin", "Hair", "Healing", "Anti-Aging"],
    variants: [{ label: "100 mg", mg: 100, price: 550, image: "/products/ghk-cu-vial-100mg.png" }],
    molecular: { sequence: "Gly-His-Lys (Cu²⁺)", formula: "C14H24N6O4·Cu", weight: "403.9 g/mol", cas: "49557-75-7" },
    purity: "99.8%",
  },
  {
    id: "wolverine-vial",
    name: "Wolverine Stack",
    subtitle: "BPC-157 + TB-500 — vial",
    form: "vial",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Dual healing stack in lyophilised vial form.",
    description:
      "Wolverine Stack (BPC-157 + TB-500) in lyophilised vial form — combining localised and systemic repair mechanisms for connective-tissue and injury recovery. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Recovery", "Healing", "Joint", "Muscle Growth"],
    variants: [{ label: "20 mg", mg: 20, price: 850, image: "/products/wolverine-vial-20mg.png" }],
    molecular: { cas: "137525-51-0 / 77591-33-4" },
    purity: "99%+",
  },
  {
    id: "glow-vial",
    name: "GLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500 — vial",
    form: "vial",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Skin, healing & recovery tri-blend, vial form.",
    description:
      "GLOW tri-blend (GHK-Cu + BPC-157 + TB-500) in lyophilised vial form — for combined skin-quality, wound-healing and systemic recovery. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Recovery", "Skin", "Healing"],
    variants: [{ label: "70 mg", mg: 70, price: 800, image: "/products/glow-vial-70mg.png" }],
    molecular: {},
    purity: "99%+",
  },
  {
    id: "klow-vial",
    name: "KLOW",
    subtitle: "GHK-Cu + BPC-157 + TB-500 + KPV — vial",
    form: "vial",
    focus: ["recovery"],
    cap: CAP.bronze,
    summary: "Quad-blend regeneration stack, vial form.",
    description:
      "KLOW quad-blend (GHK-Cu + BPC-157 + TB-500 + KPV) in lyophilised vial form — the most comprehensive regeneration option, for skin remodelling, tissue repair and inflammatory signalling. Supplied as sterile lyophilised powder for reconstitution.",
    goals: ["Recovery", "Skin", "Anti-Inflammatory", "Healing"],
    variants: [{ label: "80 mg", mg: 80, price: 950, image: "/products/klow-vial-80mg.png" }],
    molecular: {},
    purity: "99%+",
  },
];

export const ALL_GOALS = Array.from(
  new Set(PRODUCTS.flatMap((p) => p.goals))
).sort();

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function fromPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.price));
}

export function formatPrice(aed: number): string {
  return `${aed.toLocaleString("en-US")} AED`;
}
