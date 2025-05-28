export function getShortName(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);
  const firstInitial = parts[0]?.charAt(0).toUpperCase() || "";

  if (parts.length === 1) {
    return firstInitial;
  }

  const lastInitial = parts[parts.length - 1]?.charAt(0).toUpperCase() || "";
  return `${firstInitial}.${lastInitial}`;
}