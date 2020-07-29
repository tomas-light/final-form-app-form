import { Mutator } from "final-form";
import { IFormOwnProps } from "../Form";

export interface IFormPropsContainer extends IFormOwnProps {
    addMutator: (key: string, mutator: Mutator) => void;
    submitAnyway?: boolean;
}
