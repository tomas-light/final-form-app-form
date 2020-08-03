import { ComponentType } from "react";
import { FormApi } from "final-form";
import { setErrors } from "final-form-set-errors-mutator";
import {
    IValidator,
    IValidatorAsync,
    isValidator,
    isValidatorAsync,
    ModelState,
} from "model-state-validation";

import { compose } from "./compose";
import { Form, IFormProps } from "./Form";
import { FormValidator } from "./FormValidator";
import { FormPropsContainer } from "./Props/FormPropsContainer";
import { FormSettings } from "./FormSettings";
import { Submit } from "./Submit";

type ModelConstraint = {
    [x: string]: any;
};

export class FormProvider<TModel extends ModelConstraint = any> {
    private readonly validator?: IValidator<TModel> | IValidatorAsync<TModel>;
    private readonly validateAsync: (model: any) => Promise<ModelState>;
    private readonly settings: FormSettings;

    private submit: Submit;
    private formApi: FormApi;
    private formProps: FormPropsContainer;

    constructor(validator?: IValidator<TModel> | IValidatorAsync<TModel>, settings: FormSettings = {}) {
        this.validator = validator;

        if (isValidator(validator)) {
            this.validateAsync = (model: any) => Promise.resolve(validator.validate(model));
        }
        else if (isValidatorAsync(validator)) {
            this.validateAsync = (model: any) => validator.validateAsync(model);
        }
        else {
            this.validateAsync = () => Promise.resolve(new ModelState());
        }

        this.settings = settings;
        this.submit = () => undefined;
        this.formApi = null as any;
        this.formProps = null as any;

        this.submitOnClick = this.submitOnClick.bind(this);
        this.handleFormSubmitAsync = this.handleFormSubmitAsync.bind(this);
        this.setFormApi = this.setFormApi.bind(this);
    }

    createForm(submit: Submit<TModel>) {
        this.submit = submit;

        this.formProps = new FormPropsContainer(
            this.handleFormSubmitAsync,
            this.setFormApi
        );
        this.formProps.addMutator("setErrors", setErrors);

        if (this.validator) {
            const formValidator = new FormValidator(this.validator, this.settings);
            this.formProps.validate = (values: any) => formValidator.validate(this.formApi, values);
        }
        else {
            this.formProps.validate = (values: any) => this.validateAsync(values);
        }

        const FormContainer: ComponentType<IFormProps<TModel>> = compose(this.formProps.build())(Form) as any;
        return FormContainer;
    }

    submitOnClick() {
        const model: any = {
            ...this.formApi.getState().values,
        };

        this.handleFormSubmitAsync(model).then();
    }

    private async handleFormSubmitAsync(model: TModel) {
        const { setCommonErrorMessage } = this.settings;

        const modelState: ModelState = await this.validateAsync(model);
        const _setErrors = (state: ModelState) => this.formApi.mutators.setErrors(state);

        if (modelState.isInvalid()) {
            const commonError = modelState.commonError;
            if (commonError && typeof setCommonErrorMessage === "function") {
                setCommonErrorMessage(commonError.error.toString());
            }
            _setErrors(modelState);

            if (this.formProps.submitAnyway) {
                this.submit(model, false, _setErrors);
            }
            return;
        }

        if (typeof setCommonErrorMessage === "function") {
            setCommonErrorMessage("");
        }
        this.formApi.mutators.setErrors(modelState);
        this.submit(model, true, _setErrors);
    }

    private setFormApi(api: FormApi) {
        if (this.formApi !== api) {
            this.formApi = api;
        }
    }
}
