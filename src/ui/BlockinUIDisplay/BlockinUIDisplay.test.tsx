// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import BlockinUIDisplay from "./BlockinUIDisplay";
import { BlockinUIDisplayProps } from "./BlockinUIDisplay.types";

describe("Test Component", () => {
    let props: BlockinUIDisplayProps;

    beforeEach(() => {
        props = {
            foo: "bar"
        };
    });

    const renderComponent = () => render(<BlockinUIDisplay {...props} />);

    it("should render foo text correctly", () => {
        props.foo = "harvey was here";
        const { getByTestId } = renderComponent();

        const component = getByTestId("BlockinUIDisplay");

        expect(component).toHaveTextContent("harvey was here");
    });
});
