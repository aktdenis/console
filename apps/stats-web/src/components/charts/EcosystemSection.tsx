import type { FC } from "react";

import { EcosystemConstellationContainer } from "@/components/charts/EcosystemConstellation/EcosystemConstellationContainer";

export const DEPENDENCIES = { EcosystemConstellationContainer };

export type EcosystemSectionProps = {
  dependencies?: typeof DEPENDENCIES;
};

export const EcosystemSection: FC<EcosystemSectionProps> = ({ dependencies: d = DEPENDENCIES }) => <d.EcosystemConstellationContainer />;
