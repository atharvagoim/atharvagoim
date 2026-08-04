import { getIconEntry } from "../data/iconLibrary";

// A skill can either reference a preset icon (iconKey into ICON_LIBRARY) or
// carry its own custom image (customIcon = data URL / image URL).
export default function SkillIcon({ skill, className = "text-5xl" }) {
  if (skill.customIcon) {
    return (
      <img
        src={skill.customIcon}
        alt={skill.name}
        className={`${className} object-contain`}
        style={{ height: "1em", width: "1em" }}
      />
    );
  }

  const entry = getIconEntry(skill.iconKey);
  if (!entry) return null;
  const { Icon, color } = entry;
  return <Icon className={className} style={{ color: skill.color || color }} />;
}
