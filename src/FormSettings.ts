export interface FormSettings {
    setCommonErrorMessage?: (message: string) => void;
    validateOnFieldsChange?: boolean;
    resetValidationErrorOnActiveField?: boolean;
    validateOnFieldsBlur?: boolean;
    validateSpecifiedFieldsOnBlur?: string[];
}
