# Installation

```bush
npm install final-form-app-form
```
 
# How to use

## Simple

```tsx
import { Field } from "react-final-form";
import { useForm } from "final-form-app-form";

interface IFormValues {
    firstName: string;
    lastName: string;
}

interface IPageProps {
    initialValues: IFormValues;
}

interface IPageCallProps {
    submit;
}

type Props = IPageProps & IPageCallProps;

const Page = (props: Props) => {
    const {
        initialValues,
        submit,
    } = props;

    const [ Form, submitOnClick ] = useForm<IFormValues>(submit);

    return (
        <div>
            <Form initialValues={initialValues}>
                <div>
                    <label>First Name</label>
                    <Field
                      name="firstName"
                      component="input"
                      type="text"
                    />
                </div>
                <div>
                    <label>Last Name</label>
                    <Field
                      name="lastName"
                      component="input"
                      type="text"
                    />
                </div>
            </Form>

            {/* some other components*/}

            <button onClick={submitOnClick}>
                submit form remotely
            </button>
        </div>
    );
};
```

## With validator

```tsx
import { Field } from "react-final-form";
import { useForm } from "final-form-app-form";
import { ModelState, IValidator } from "model-state-validation";

interface IFormValues {
    firstName: string;
    lastName: string;
}

class FormValuesValidator implements IValidator<IFormValues> {
    validate(model: IFormValues): ModelState {
        const modelState = new ModelState();
        if (!model.firstName) {
            modelState.addError("firstName", "required field");
        }
        if (!model.lastName) {
            modelState.addError("firstName", "required field");
        }
        return modelState;
    }
}

interface IPageProps {
    initialValues: IFormValues;
}

interface IPageCallProps {
    submit;
}

type Props = IPageProps & IPageCallProps;

const Page = (props: Props) => {
    const { 
        initialValues,
        submit,
    } = props;

    const [ Form, submitOnClick ] = useForm<IFormValues>(submit, new FormValuesValidator());

    return (
        <div>
            <Form initialValues={initialValues}>
                <div>
                    <label>First Name</label>
                    <Field name="firstName" >
                        {({ input, meta }) => (
                          <>
                            <input {...input} type="text" />
                            {meta.error && meta.touched && <span>{meta.error}</span>}
                          </>
                        )}
                    </Field>
                </div>
                <div>
                    <label>Last Name</label>
                    <Field name="lastName" >
                        {({ input, meta }) => (
                          <>
                            <input {...input} type="text" />
                            {meta.error && meta.touched && <span>{meta.error}</span>}
                          </>
                        )}
                    </Field>
                </div>
            </Form>

            {/* some other components*/}

            <button onClick={submitOnClick}>
                submit form remotely
            </button>
        </div>
    );
};
```

## Using of FormState

```tsx
import { FormState } from "final-form";
import { Field } from "react-final-form";
import { useForm } from "final-form-app-form";

interface IFormValues {
    firstName: string;
    lastName: string;
}

interface IPageProps {
    initialValues: IFormValues;
}

interface IPageCallProps {
    submit;
}

type Props = IPageProps & IPageCallProps;

const Page = (props: Props) => {
    const {
        initialValues,
        submit,
    } = props;

    const [ Form, submitOnClick ] = useForm<IFormValues>(submit);

    return (
        <div>
            <Form initialValues={initialValues} subscribe={{ pristine: true }}>
                {(state: FormState) => (
                    <>
                        <div>
                            <label>First Name</label>
                            <Field
                              name="firstName"
                              component="input"
                              type="text"
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <Field
                              name="lastName"
                              component="input"
                              type="text"
                            />
                        </div>
                        <p>
                            {state.pristine ? "form is pristine" : "form is dirty"}
                        </p>
                    </>
                )}
            </Form>

            {/* some other components*/}

            <button onClick={submitOnClick}>
                submit form remotely
            </button>
        </div>
    );
};
```


## Additional settings

```tsx
import { useState } from "react";
import { useForm } from "final-form-app-form";
import { ModelState, IValidator } from "model-state-validation";

interface IFormValues {
    firstName: string;
    lastName: string;
}

class FormValuesValidator implements IValidator<IFormValues> {
    validate(model: IFormValues): ModelState {
        // validation logic
        // ...
    }
}


const Page = (props) => {
    const {
        initialValues,
        submit,
    } = props;

    const [ validationMessage, setValidationMessage ] = useState("");

    const [ Form, submitOnClick ] = useForm<IFormValues>(
        submit,
        new FormValuesValidator(),
        { 
            setCommonErrorMessage: setValidationMessage,
            validateOnFieldsChange: true,
            resetValidationErrorOnActiveField: true,
            validateOnFieldsBlur: true,
            // validateSpecifiedFieldsOnBlur: [ "firstName" ],
        }
    );

    return (
        <div>
            // render form etc
            // ...

            <p style={{ color: "red" }}>
                {validationMessage}
            </p>
        </div>
    );
};
```
