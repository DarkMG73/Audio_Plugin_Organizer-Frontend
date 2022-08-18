const useToolDisplayOrder = (pluginSchema) => {
  if (!pluginSchema) return [];
  const setOrder = [
    "name",
    "photoURL",
    "functions",
    "color",
    "precision",
    "company",
    "productURL",
    "notes",
  ];

  const orderSet = new Set();
  setOrder.map((topic) => orderSet.add(topic));
  Object.keys(pluginSchema).map((topic) => orderSet.add(topic));

  const order = Array.from(orderSet);
  return order;
};

export default useToolDisplayOrder;
