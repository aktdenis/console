import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";

import { cleanup } from "@testing-library/react";

process.env.NEXT_PUBLIC_API_BASE_URL ??= "http://localhost/api";
process.env.NEXT_PUBLIC_BASE_API_TESTNET_URL ??= "http://localhost/testnet";
process.env.NEXT_PUBLIC_BASE_API_SANDBOX_URL ??= "http://localhost/sandbox";
process.env.NEXT_PUBLIC_BASE_API_MAINNET_URL ??= "http://localhost/mainnet";

afterEach(() => {
  cleanup();
});
