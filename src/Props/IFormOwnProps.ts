import { FormApi } from "final-form";
import { FormMutators } from "../FormMutators";
import { Submit } from "../Submit";

export interface IFormOwnProps {
    setFormApi: (api: FormApi) => void;
    submit: Submit;
    mutators?: FormMutators;
    validate?: (formValues: any) => any;
}
