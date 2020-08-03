import React from "react";

export function compose(containerProps: any) {
    return function (Component: any) {
        return (props: any) => Component({
            ...containerProps,
            ...props,
        });
    };
}
