import { ComponentType, useMemo } from "react";
import { IValidator, IValidatorAsync } from "model-state-validation";

import { FormProvider } from "./FormProvider";
import { FormSettings } from "./FormSettings";
import { IFormProps } from "./Form";
import { Submit } from "./Submit";

export function useForm<TModel>(
    submit: Submit<TModel>,
    validator: IValidator<TModel> | IValidatorAsync<TModel>,
    settings?: FormSettings
): [ ComponentType<IFormProps<TModel>>, () => void] {

    return useMemo(
        () => {
            const formProvider = new FormProvider<TModel>(validator, settings);
            return [
                formProvider.createForm(submit),
                formProvider.submitOnClick,
            ];
        }, [ submit, validator, settings ]
    );
}
