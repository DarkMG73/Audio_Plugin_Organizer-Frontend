const appCookieName = "gi-Production-Tool-local";

function storage(action, data, name) {
   data = JSON.stringify(data);
   const storageFileName = name ? name : appCookieName;
   let output = null;
   if (action === "ADD") {
      output = localStorage.setItem(storageFileName, data);
   }

   if (action === "GET") {
      output = localStorage.getItem(storageFileName);

      try {
         output = JSON.parse(output);
      } catch {}
   }

   if (action === "DELETE") {
      output = localStorage.removeItem(storageFileName);
   }

   return output;
}

export function StorageForSession(action, data, name) {
   if (data && Object.keys(data).length > 0) data = JSON.stringify(data);
   const storageFileName = name ? name : appCookieName;

   let output = null;
   if (action === "ADD") {
      output = sessionStorage.setItem(storageFileName, data);
   }

   if (action === "GET") {
      output = sessionStorage.getItem(storageFileName);
      try {
         output = JSON.parse(output);
      } catch (error) {}

      if (output && output.hasOwnProperty("token")) output = output.token;
   }

   if (action === "DELETE") {
      output = sessionStorage.removeItem(storageFileName);
   }

   return output;
}

export default storage;
