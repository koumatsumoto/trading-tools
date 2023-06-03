import { afterAll, afterEach, beforeAll } from "vitest";
import { TestHelpers } from "./src/testing";

beforeAll(() => TestHelpers.msw.listen({ onUnhandledRequest: "error" }));
afterEach(() => TestHelpers.msw.resetHandlers());
afterAll(() => TestHelpers.msw.close());
