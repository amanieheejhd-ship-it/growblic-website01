import {
  INTERNSHIP_CERTIFICATE_SKILL_CATALOG,
  type InternshipCertificateDomainRole,
} from "@growblic/contracts";

export function partitionCertificateSkills(
  role: InternshipCertificateDomainRole | null,
  skills: string[],
) {
  const catalog = new Set<string>(
    role ? INTERNSHIP_CERTIFICATE_SKILL_CATALOG[role] : [],
  );
  return {
    selectedSkills: skills.filter((skill) => catalog.has(skill)),
    customSkills: skills.filter((skill) => !catalog.has(skill)),
  };
}

export function compatibleSkillsForRole(
  role: InternshipCertificateDomainRole,
  selectedSkills: string[],
) {
  const catalog = new Set<string>(INTERNSHIP_CERTIFICATE_SKILL_CATALOG[role]);
  return {
    compatible: selectedSkills.filter((skill) => catalog.has(skill)),
    incompatible: selectedSkills.filter((skill) => !catalog.has(skill)),
  };
}

export function normalizeCustomSkill(
  value: string,
  existingSkills: string[],
): { error: string } | { skill: string } {
  const normalized = value.normalize("NFKC").replace(/\s+/g, " ").trim();
  if (!normalized) return { error: "Enter a custom skill." };
  if (normalized.length > 80) {
    return { error: "Custom skills must be 80 characters or fewer." };
  }
  if (existingSkills.some((skill) =>
    skill.toLocaleLowerCase("en") === normalized.toLocaleLowerCase("en"))) {
    return { error: "This skill has already been added." };
  }
  return { skill: normalized };
}

export function certificateSkillsForSubmission(
  role: InternshipCertificateDomainRole | null,
  selectedSkills: string[],
  customSkills: string[],
) {
  if (!role) return [...customSkills];
  const catalog = new Set<string>(INTERNSHIP_CERTIFICATE_SKILL_CATALOG[role]);
  return [
    ...selectedSkills.filter((skill) => catalog.has(skill)),
    ...customSkills,
  ];
}
