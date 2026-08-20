// @vitest-environment jsdom
import { IntlProvider } from "react-intl";
import { describe, expect, it } from "vitest";

import { DiffPercentageChip } from "@/components/DiffPercentageChip";
import { render, screen } from "@testing-library/react";

describe(DiffPercentageChip.name, () => {
  it("renders a positive delta with an explicit plus sign", () => {
    setup({ value: 0.0167 });

    const chip = screen.getByText("+1.67%");
    expect(chip).toHaveClass("text-success");
  });

  it("renders a negative delta with a minus sign", () => {
    setup({ value: -0.0374 });

    const chip = screen.getByText("-3.74%");
    expect(chip).toHaveClass("text-destructive");
  });

  it("renders an exactly-zero delta as neutral with no sign", () => {
    setup({ value: 0 });

    const chip = screen.getByText("0.00%");
    expect(chip).toHaveClass("text-muted-foreground");
    expect(chip).not.toHaveClass("text-success");
    expect(chip).not.toHaveClass("text-destructive");
  });

  it("renders nothing when value is not a number", () => {
    const { container } = setup({ value: undefined as unknown as number });

    expect(container).toBeEmptyDOMElement();
  });

  function setup(props: { value: number }) {
    return render(<DiffPercentageChip {...props} />, {
      wrapper: ({ children }) => <IntlProvider locale="en-US">{children}</IntlProvider>
    });
  }
});
