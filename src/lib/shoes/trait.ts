/**
 * Traits grant bonuses to certain rolls or actions.
 */

export class TraitItem {
    constructor(public name: string, public description: string, public level: number = 1, public uses: number = Infinity) {}

    levelUp() {
        return new TraitItem(this.name, this.description, this.level + 1, this.uses);
    }

    use() {
        if (this.uses === Infinity) {
            return this;
        }
        return new TraitItem(this.name, this.description, this.level, this.uses - 1);
    }

    toString() {
        return `${this.name} (Level ${this.level})`;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            level: this.level,
            uses: this.uses
        };
    }
}