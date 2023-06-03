import { type Path, type ResponseResolver, rest, RestContext, RestRequest } from "msw";
import { setupServer } from "msw/node";

const msw = setupServer();

function mockGetApi(path: Path, resolver: ResponseResolver<RestRequest, RestContext>) {
  msw.use(rest.get(path, resolver));
}

export const TestHelpers = {
  msw,
  mockGetApi,
} as const;
