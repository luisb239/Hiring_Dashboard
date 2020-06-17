export class CreateRequestProps {
    mandatoryCheckboxes = [];
    valuedCheckboxes = [];
    selectedMandatoryCheckboxes = [];
    selectedValuedCheckboxes = [];

    inputDescription: string;
    inputQuantity: number;
    inputSkill: string;
    inputProfile: string;
    inputProject: string;
    inputWorkflow: string;
    inputTargetDate: string;
    inputDateToSendProfile: string;

    skills: string[];
    profiles: string[];
    projects: string[];
    workflows: string[];
    targetDates: string[];
}
