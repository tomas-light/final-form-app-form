import React from "react";

export function compose(props: any) {
    return (Form: (formOwnProps: any) => any): any => (
        <Form {...props} />
    );
}
