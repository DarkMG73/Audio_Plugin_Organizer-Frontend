import SetFilteredToolList from "./SetFilteredToolList";

const tools = {
   eq1: {
      _id: "eq1",
      name: "Pro-Q 3",
      company: "FabFilter",
      functions: ["Frequency Control ~ EQ"],
      color: ["Modern"],
      precision: ["Digital Precision"],
      rating: 5,
      favorite: true,
      notes: "clean surgical vocal eq"
   },
   comp1: {
      _id: "comp1",
      name: "Decapitator",
      company: "Soundtoys",
      functions: ["Saturation ~ Distortion", "Dynamics ~ Compressor"],
      color: ["Vintage ('60's & Earlier)"],
      precision: ["Vibey Analog"],
      rating: "4",
      favorite: "false",
      notes: "warm analog crunch"
   },
   delay1: {
      _id: "delay1",
      name: "H-Delay",
      company: "Waves",
      functions: ["Time and Space ~ Delay"],
      color: ["80's"],
      precision: ["Digital Precision"],
      rating: 3,
      favorite: false,
      notes: ""
   }
};

describe("SetFilteredToolList", () => {
   test("returns empty list when nothing is selected so the UI can show all plugins", () => {
      expect(
         SetFilteredToolList(tools, { functions: [], company: [] }, "")
      ).toEqual([]);
   });

   test("ORs values within a category", () => {
      const ids = SetFilteredToolList(
         tools,
         { functions: ["Frequency Control ~ EQ", "Time and Space ~ Delay"] },
         ""
      );
      expect(ids.sort()).toEqual(["delay1", "eq1"]);
   });

   test("ANDs across categories", () => {
      const ids = SetFilteredToolList(
         tools,
         {
            functions: ["Saturation ~ Distortion"],
            precision: ["Vibey Analog"]
         },
         ""
      );
      expect(ids).toEqual(["comp1"]);
   });

   test("treats rating as this-or-better", () => {
      const ids = SetFilteredToolList(tools, { rating: [4] }, "");
      expect(ids.sort()).toEqual(["comp1", "eq1"]);
   });

   test("matches favorite whether stored as boolean or string", () => {
      const ids = SetFilteredToolList(tools, { favorite: [true] }, "");
      expect(ids).toEqual(["eq1"]);
   });

   test("search matches name, company, notes, and function labels", () => {
      expect(SetFilteredToolList(tools, {}, "fabfilter")).toEqual(["eq1"]);
      expect(SetFilteredToolList(tools, {}, "warm analog")).toEqual(["comp1"]);
      expect(SetFilteredToolList(tools, {}, "eq")).toEqual(["eq1"]);
   });

   test("search plus filters stay AND'd", () => {
      const ids = SetFilteredToolList(
         tools,
         { functions: ["Dynamics ~ Compressor", "Frequency Control ~ EQ"] },
         "soundtoys"
      );
      expect(ids).toEqual(["comp1"]);
   });
});
