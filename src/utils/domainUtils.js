export function validateDomain(input) {
  // Remove whitespace
  input = input.trim();

  // Skip empty lines
  if (!input) return null;

  // Skip comments
  if (input.startsWith('#')) return null;

  // Remove protocol
  input = input.replace(/^https?:\/\//, '');

  // Remove www.
  input = input.replace(/^www\./, '');

  // Basic domain validation
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/;
  return domainRegex.test(input) ? input : null;
}

