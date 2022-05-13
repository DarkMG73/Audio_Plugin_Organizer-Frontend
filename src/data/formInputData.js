export const formInputData = [
  { title: "name", type: "text", options: [], required: true },
  {
    title: "company",
    type: "select",
    options: ["Klienhelm", "SoftTube", "Brainworx", "SPL"],
    required: "true",
  },
  {
    title: "use",
    type: "checkbox",
    options: ["Compressor", "EQ", "Saturator"],
    value: "Use Case",
    required: "false",
  },
  {
    title: "precision",
    type: "checkbox",
    options: ["Vibey", "Precise"],
    value: "Precision",
    required: "false",
  },
  {
    title: "color",
    type: "checkbox",
    options: [
      "Vintage ('60's & Earlier)",
      "'70's",
      "'80's",
      "Modern",
      "Sci-Fi",
    ],
    value: "Color",
    required: "false",
  },
];
