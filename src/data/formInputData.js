import topicOptions from "./topicOptions";
export const formInputData = {
   name: {
      title: "Name",
      name: "name",
      type: "text",
      options: [],
      required: true,
      preFilledData: ""
   },
   company: {
      title: "Company",
      name: "company",
      type: "datalist",
      options: ["", ...topicOptions.company],
      required: false,
      preFilledData: ""
   },
   functions: {
      title: "Functions",
      name: "functions",
      type: "checkbox",
      options: topicOptions.functions,
      value: "Use Case",
      required: "false",
      preFilledData: ""
   },
   precision: {
      title: "Precision",
      name: "precision",
      type: "checkbox",
      options: topicOptions.precision,
      value: "Precision",
      required: false,
      preFilledData: ""
   },
   color: {
      title: "Color",
      name: "color",
      type: "checkbox",
      options: topicOptions.color,
      value: "Color",
      required: false,
      preFilledData: ""
   },
   productURL: {
      title: "Product Page Link",
      name: "productURL",
      type: "url",
      options: [],
      required: false,
      preFilledData: ""
   },
   photoURL: {
      title: "Photo Link",
      name: "photoURL",
      type: "url",
      options: [],
      required: false,
      preFilledData: ""
   },
   oversampling: {
      title: "Oversampling",
      name: "oversampling",
      type: "radio",
      options: ["true", "false"],
      required: false,
      preFilledData: ""
   },
   favorite: {
      title: "Favorite",
      name: "favorite",
      type: "radio",
      options: ["true", "false"],
      required: false,
      preFilledData: ""
   },
   rating: {
      title: "Rating (1=Low & 5=Best)",
      name: "rating",
      type: "radio",
      options: ["1", "2", "3", "4", "5"],
      required: false,
      preFilledData: ""
   },
   status: {
      title: "Status",
      name: "status",
      type: "select",
      options: topicOptions.status,
      required: false,
      preFilledData: "Active"
   },
   notes: {
      title: "Notes",
      name: "notes",
      type: "textarea",
      options: [],
      required: false,
      preFilledData: ""
   }
};
