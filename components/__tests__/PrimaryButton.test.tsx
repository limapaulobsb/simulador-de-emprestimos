import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PrimaryButton from "../PrimaryButton";
import { Colors } from "@/constants";

describe("PrimaryButton", () => {
  test("renders children text", () => {
    const { getByText } = render(<PrimaryButton>Enviar</PrimaryButton>);
    expect(getByText("Enviar")).toBeTruthy();
  });

  test("calls onPress when pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(<PrimaryButton onPress={onPress}>OK</PrimaryButton>);
    fireEvent.press(getByText("OK"));
    expect(onPress).toHaveBeenCalled();
  });

  test("shows ActivityIndicator when loading", () => {
    const { UNSAFE_queryByType } = render(
      <PrimaryButton isLoading onPress={() => {}}>
        Qualquer
      </PrimaryButton>,
    );
    // ActivityIndicator is rendered instead of text
    expect(UNSAFE_queryByType(require("react-native").ActivityIndicator)).toBeTruthy();
  });

  test("variant secondary changes backgroundColor", () => {
    const { toJSON } = render(<PrimaryButton variant="secondary">Sec</PrimaryButton>);
    const tree = toJSON() as any;
    // View is first element, check style backgroundColor
    const viewStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style)
      : tree.props.style;
    expect(viewStyle.backgroundColor).toBe(Colors.primary90);
  });

  test("variant secondaryOutlined renders transparent background", () => {
    const { toJSON } = render(<PrimaryButton variant="secondaryOutlined">Out</PrimaryButton>);
    const tree = toJSON() as any;
    const viewStyle = Array.isArray(tree.props.style)
      ? Object.assign({}, ...tree.props.style)
      : tree.props.style;
    expect(viewStyle.backgroundColor).toBe("transparent");
    expect(viewStyle.borderWidth).toBe(1);
  });
});
