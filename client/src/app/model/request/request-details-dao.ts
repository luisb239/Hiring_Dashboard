
export class RequestDetailsDao {
  constructor(
    public description: string,
    public project: string,
    public skill: string,
    public stateCsl: string,
    public state: string,
    public targetDate: string,
    public workflow: string,
    public profile: string,
    public quantity: number,
    public mandatoryLanguages: string[],
    public valuedLanguages: string[],
    public id: number = 0,
    public progress: number = 0,
    public requestDate: string = null,
    public dateToSendProfile: string = null) { }
}
