// Load the Sheet from local storage, or create a new one if it doesn't exist.
import type { Sheet } from "./sheet.type";
import { browser } from "$app/environment";
import { SkillItem } from "./skill";
import { TraitItem } from "./trait";

export function loadSheet(): Sheet {
    if (!browser) {
        return {
            name: "",
            briefdesc: "",
            notes: "",
            xp: 0,
            skills: [],
            traits: []
        };
    }
    const sheetString = localStorage.getItem("sheet");
    if (sheetString) {
        const parsed = JSON.parse(sheetString);
        return {
            ...parsed,
            skills: parsed.skills.map((s: any) => new SkillItem(s.name, s.level)),
            traits: parsed.traits.map((t: any) => new TraitItem(t.name, t.description, t.level, t.uses))
        };
    } else {
        return {
            name: "Test Character",
            briefdesc: "",
            notes: "",
            xp: 0,
            skills: [
                new SkillItem("Do Anything", 1)
            ],
            traits: []
        };
    }
}

export function saveSheet(sheet: Sheet) {
    if (!browser) return;
    localStorage.setItem("sheet", JSON.stringify(sheet));
}

export function clearSheet() {
    if (!browser) return;
    localStorage.removeItem("sheet");
}
