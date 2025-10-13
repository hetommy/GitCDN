import { getPreferenceValues } from "@raycast/api";

export interface GitCDNPreferences {
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch: string;
}

export function getPreferences(): GitCDNPreferences {
  const prefs = getPreferenceValues<GitCDNPreferences>();
  return {
    githubToken: prefs.githubToken || "",
    githubOwner: prefs.githubOwner || "",
    githubRepo: prefs.githubRepo || "",
    githubBranch: prefs.githubBranch || "main",
  };
}

export function validatePreferences(): { valid: boolean; missing: string[] } {
  const prefs = getPreferences();
  const missing: string[] = [];

  if (!prefs.githubToken) missing.push("GitHub Personal Access Token");
  if (!prefs.githubOwner) missing.push("GitHub Owner");
  if (!prefs.githubRepo) missing.push("GitHub Repository");

  return {
    valid: missing.length === 0,
    missing,
  };
}

export function getMissingPreferencesMessage(): string {
  const { missing } = validatePreferences();
  return `Missing required preferences: ${missing.join(", ")}. Please configure them in Raycast preferences.`;
}
