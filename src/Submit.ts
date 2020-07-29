import { ModelState } from "model-state-validation";

export type Submit<TModel = any> = (
    model: TModel,
    validationResult?: boolean,
    setFormErrors?: (modelState: ModelState) => void
) => void;
