const appCookieName = "gi-Production-Tool-local";

function storage(action, data, name) {
  data = JSON.stringify(data);
  const storageFileName = name ? name : appCookieName;
  let output = null;
  if (action === "ADD") {
    output = localStorage.setItem(storageFileName, data);
  }

  if (action === "GET") {
    output = JSON.parse(localStorage.getItem(storageFileName));
  }

  if (action === "DELETE") {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your question history? If you do, this will erase your question history from your local browser storage. This will not affect the question database."
    );
    if (shouldDelete) output = localStorage.removeItem(storageFileName);
  }

  return output;
}

export function StorageForSession(action, data, name) {
  data = JSON.stringify(data);
  const storageFileName = name ? name : appCookieName;

  let output = null;
  if (action === "ADD") {
    output = sessionStorage.setItem(storageFileName, data);
  }

  if (action === "GET") {
    output = JSON.parse(sessionStorage.getItem(storageFileName));

    if (output && output.hasOwnProperty("token")) output = output.token;
  }

  if (action === "DELETE") {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete your question history? If you do, this will erase your question history from your local browser storage. This will not affect the question database."
    );
    if (shouldDelete) output = sessionStorage.removeItem(storageFileName);
  }

  return output;
}

export default storage;
