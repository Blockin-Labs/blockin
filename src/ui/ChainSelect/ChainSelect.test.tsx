// Generated with util/create-component.js
import React from "react";
import { render } from "@testing-library/react";

import ChainSelect from "./ChainSelect";
import { ChainSelectProps } from "./ChainSelect.types";

describe("Test Component", () => {
  let props: ChainSelectProps;

  beforeEach(() => {
    props = {
      foo: "bar"
    };
  });

  const renderComponent = () => render(<ChainSelect {...props} />);

  it("should render foo text correctly", () => {
    props.foo = "harvey was here";
    const { getByTestId } = renderComponent();

    const component = getByTestId("ChainSelect");

    expect(component).toHaveTextContent("harvey was here");
  });
});
