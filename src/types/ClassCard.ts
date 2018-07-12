export class ClassCard {

    constructor(
        public ID: number,
        private title: string,
        private maxSubmission: number,
        private submissions: Array<{ status: string, count: number }>,
        private subject: string,
        private date: Date,
        private student: number,
        private room: string,
    ) { }

    public toString(): string {
        // tslint:disable:object-literal-sort-keys
        return JSON.stringify({
            ID: this.ID,
            title: this.title,
            maxSubmission: this.maxSubmission,
            submissions: this.submissions,
            subject: this.subject,
            date: this.date,
            student: this.student,
            room: this.room,
        });
    }

    public addSubmission(value: { status: string, count: number }) {
        this.submissions.push(value);
    }

}
