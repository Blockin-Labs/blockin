// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import SignInWithBlockinButton from "./SignInWithBlockinButton";
import { SignInWithBlockinButtonProps } from "./SignInWithBlockinButton.types";

describe("Test Component", () => {
    let props: SignInWithBlockinButtonProps;

    beforeEach(() => {
        props = {
            foo: "bar"
        };
    });

    const renderComponent = () => render(<SignInWithBlockinButton {...props} />);

    it("should render foo text correctly", () => {
        props.foo = "harvey was here";
        const { getByTestId } = renderComponent();

        const component = getByTestId("SignInWithBlockinButton");

        expect(component).toHaveTextContent("harvey was here");
    });
});
