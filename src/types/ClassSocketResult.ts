import { ClassCard } from "classCard";
import { IClassSocketQuery } from "IClassSocketQuery";

export class ClassSocketResult {
    constructor(private sender: "server" | "local", private classes?: ClassCard[], private query?: IClassSocketQuery) { }

    public toString(): string {
        return JSON.stringify({
            classes: this.classes,
            query: this.query,
            sender: this.sender,
        });
    }
}
