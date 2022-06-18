export const formInputData = {
  name: {
    title: "Name",
    name: "name",
    type: "text",
    options: [],
    required: true,
    preFilledData: "",
  },
  company: {
    title: "Company",
    name: "company",
    type: "select",
    options: ["Klienhelm", "SoftTube", "Brainworx", "SPL"],
    required: "true",
    preFilledData: "",
  },
  functions: {
    title: "Functions",
    name: "functions",
    type: "checkbox",
    options: ["Compressor", "EQ", "Saturator"],
    value: "Use Case",
    required: "false",
    preFilledData: "",
  },
  precision: {
    title: "Precision",
    name: "precision",
    type: "checkbox",
    options: ["Vibey Analog", "Analog Mastering", "Digital Precision"],
    value: "Precision",
    required: "false",
    preFilledData: "",
  },
  color: {
    title: "Color",
    name: "color",
    type: "checkbox",
    options: [
      "Vintage ('60's & Earlier)",
      "70's",
      "80's",
      "Modern",
      "Extreme",
      "Sci-Fi",
    ],
    value: "Color",
    required: "false",
    preFilledData: "",
  },
  productURL: {
    title: "Product Page Link",
    name: "productURL",
    type: "url",
    options: [],
    required: false,
    preFilledData: "",
  },
  photoURL: {
    title: "Photo Link",
    name: "photoURL",
    type: "url",
    options: [],
    required: false,
    preFilledData: "",
  },
  favorite: {
    title: "Favorite",
    name: "favorite",
    type: "radio",
    options: ["true", "false"],
    required: false,
    preFilledData: "",
  },
  rating: {
    title: "Rating (1=Low & 5=Best)",
    name: "rating",
    type: "radio",
    options: ["1", "2", "3", "4", "5"],
    required: false,
    preFilledData: "",
  },
  notes: {
    title: "Notes",
    name: "notes",
    type: "textarea",
    options: [],
    required: false,
    preFilledData: "",
  },
};
