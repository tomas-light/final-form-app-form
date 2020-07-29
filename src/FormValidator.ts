import { FormApi } from "final-form";
import {
    IValidator,
    IValidatorAsync,
    isValidator,
    isValidatorAsync,
    ModelState,
} from "model-state-validation";

import { FormSettings } from "./FormSettings";

export class FormValidator {
    private readonly validateAsync: (model: any) => Promise<ModelState>;
    private readonly settings: FormSettings;
    private lastActiveFieldName: string | undefined;

    constructor(validator: IValidator<any> | IValidatorAsync<any>, settings: FormSettings) {
        this.settings = settings;

        if (isValidator(validator)) {
            this.validateAsync = (model: any) => Promise.resolve(validator.validate(model));
        }
        else if (isValidatorAsync(validator)) {
            this.validateAsync = (model: any) => validator.validateAsync(model);
        }
        else {
            throw new Error("Invalid argument validator");
        }
    }

    validate(formApi: FormApi, values: any): Promise<any> {
        const {
            validateOnFieldsChange,
            resetValidationErrorOnActiveField,
            validateOnFieldsBlur,
            validateSpecifiedFieldsOnBlur,
        } = this.settings;

        if (!formApi) {
            return Promise.resolve(true);
        }

        if (validateOnFieldsChange) {
            return this.validateOnFieldsChange(formApi, values);
        }

        if (validateOnFieldsBlur) {
            return this.validateOnFieldsBlur(formApi, values);
        }

        if (validateSpecifiedFieldsOnBlur) {
            return this.validateSpecifiedFieldsOnBlur(formApi, values);
        }

        if (resetValidationErrorOnActiveField) {
            const { errors, active } = formApi.getState();
            return this.resetValidationErrorOnActiveField(errors, active);
        }

        return Promise.resolve(formApi.getState().errors);
    }

    private async validateOnFieldsChange(formApi: FormApi, values: any) {
        const { active } = formApi.getState();
        const { resetValidationErrorOnActiveField } = this.settings;

        const validationResult = await this.validateAsync(values);
        let validationErrors = validationResult.getErrors();

        if (resetValidationErrorOnActiveField) {
            validationErrors = this.resetValidationErrorOnActiveField(validationErrors, active);
        }

        this.lastActiveFieldName = active;
        return validationErrors;
    }

    private async validateOnFieldsBlur(formApi: FormApi, values: any) {
        const { active, errors } = formApi.getState();
        const { resetValidationErrorOnActiveField } = this.settings;

        let validationErrors = { ...errors };

        const isOnBlur = this.lastActiveFieldName !== undefined && active === undefined;
        if (isOnBlur) {
            const validationResult = await this.validateAsync(values);
            const newErrors = validationResult.getErrors();

            if (typeof this.lastActiveFieldName === "string") {
                // correct error for blurred field
                validationErrors[this.lastActiveFieldName] = newErrors[this.lastActiveFieldName];
            }
        }
        else if (resetValidationErrorOnActiveField) {
            validationErrors = this.resetValidationErrorOnActiveField(validationErrors, active);
        }

        this.lastActiveFieldName = active;
        return validationErrors;
    }

    private async validateSpecifiedFieldsOnBlur(formApi: FormApi, values: any) {
        const { active, errors } = formApi.getState();
        const {
            resetValidationErrorOnActiveField,
            validateSpecifiedFieldsOnBlur,
        } = this.settings;

        let validationErrors = { ...errors };

        const isOnBlur = this.lastActiveFieldName !== undefined && active === undefined;
        if (isOnBlur && validateSpecifiedFieldsOnBlur &&
            validateSpecifiedFieldsOnBlur.some((fieldName: string) => fieldName === this.lastActiveFieldName)
        ) {
            const validationResult = await this.validateAsync(values);
            const newErrors = validationResult.getErrors();

            if (typeof this.lastActiveFieldName === "string") {
                // correct error for blurred field
                validationErrors[this.lastActiveFieldName] = newErrors[this.lastActiveFieldName];
            }
        }
        else if (resetValidationErrorOnActiveField) {
            validationErrors = this.resetValidationErrorOnActiveField(validationErrors, active);
        }

        this.lastActiveFieldName = active;
        return validationErrors;
    }

    private resetValidationErrorOnActiveField(errors: any, activeFieldName: string | undefined) {
        if (activeFieldName !== undefined) {
            return {
                ...errors,
                [activeFieldName]: undefined,
            };
        }

        return errors;
    }
}
