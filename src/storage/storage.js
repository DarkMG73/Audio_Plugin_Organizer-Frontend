function storage(action, data) {
  data = JSON.stringify(data);
  const storageFileName = "gi-plugin-tool";
  let output = null;
  if (action === "add") {
    output = localStorage.setItem(storageFileName, data);
  }

  if (action === "get") {
    output = JSON.parse(localStorage.getItem(storageFileName));
  }

  if (action === "delete") {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your question history? If you do, this will erase your question history from your local browser storage. This will not affect the question database."
    );
    if (shouldDelete) output = localStorage.removeItem(storageFileName);
  }

  return output;
}

export default storage;
