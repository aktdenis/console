// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

import { DEPENDENCIES, EcosystemSection } from "@/components/charts/EcosystemSection";
import { render } from "@testing-library/react";
import { MockComponents } from "@tests/unit/mocks";

describe(EcosystemSection.name, () => {
  it("renders the provider constellation", () => {
    const { deps } = setup();

    expect(deps.EcosystemConstellationContainer).toHaveBeenCalled();
  });

  function setup(input?: { dependencies?: Partial<typeof DEPENDENCIES> }) {
    const deps = MockComponents(DEPENDENCIES, input?.dependencies);
    const result = render(<EcosystemSection dependencies={deps} />);

    return { deps, ...result };
  }
});
