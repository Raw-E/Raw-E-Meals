// Utility function to sanitize JSON input
function sanitizeJSON(input) {
  // Replacing single quotes with double quotes
  let sanitized = input.replace(/'/g, '"');
  // Adding double quotes around keys in JSON
  sanitized = sanitized.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
  // Removing trailing commas in JSON
  sanitized = sanitized.replace(/,\s*([}\]])/g, "$1");
  return sanitized;
}

export default sanitizeJSON;
