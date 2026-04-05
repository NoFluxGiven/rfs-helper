import type { SkillItem } from "./skill";
import type { TraitItem } from "./trait";

export type Sheet = {
    name: string;
    briefdesc: string;
    notes: string;
    xp: number;
    skills: SkillItem[];
    traits: TraitItem[];
}