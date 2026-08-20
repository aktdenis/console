import { vi } from "vitest";

function ComponentMock(props: Record<string, any>) {
  return <>{props.children}</>;
}

export function MockComponents<T extends Record<string, any>>(components: T, overrides?: Partial<T>): Mocked<T> {
  return Object.keys(components).reduce((all, name: keyof T) => {
    all[name] = overrides?.[name] || (vi.fn(typeof name === "string" && name.startsWith("use") ? undefined : ComponentMock) as T[keyof T]);
    return all;
  }, {} as T) as Mocked<T>;
}

type SpyCalls = { mock: { calls: any[][] } };

/**
 * Intersects each member with a minimal spy shape instead of replacing it with vitest's
 * MockedFunction<T>, which collapses multi-signature component types (e.g. recharts' XAxis)
 * to an incompatible arity and fails assignment back to the original dependencies type.
 */
export type Mocked<T extends Record<string, any>> = {
  [K in keyof T]: T[K] & SpyCalls;
};
