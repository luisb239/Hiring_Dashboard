
export class CandidateList {
    id: number;
    name: string;
    cv: string;
    available: boolean;
    profileInfo: string;
    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
