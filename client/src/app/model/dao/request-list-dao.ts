
export class RequestListDao {
  id: number;
  description: string;
  progress: number;
  project: string;
  quantity: number;
  requestDate: string;
  skill: string;
  stateCsl: string;
  state: string;
  targetDate: string;
  workflow: string;
  profile: string;
  mandatoryLanguages: string[];
  valuedLanguages: string[];
  dateToSendProfile: string;
  constructor(
    description: string,
    project: string,
    quantity: number,
    skill: string,
    stateCsl: string,
    state: string,
    targetDate: string,
    workflow: string,
    profile: string,
    mandatoryLanguages: string[],
    valuedLanguages: string[],
    dateToSendProfile: string = null) {
    this.description = description;
    this.project = project;
    this.quantity = quantity;
    this.skill = skill;
    this.stateCsl = stateCsl;
    this.state = state;
    this.targetDate = targetDate;
    this.workflow = workflow;
    this.profile = profile;
    this.mandatoryLanguages = mandatoryLanguages;
    this.valuedLanguages = valuedLanguages;
    this.dateToSendProfile = dateToSendProfile;
  }
}
