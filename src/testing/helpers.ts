import { type Path, type ResponseResolver, rest, type RestContext, type RestRequest } from "msw";
import { type SetupServer, setupServer } from "msw/node";

const msw = setupServer();

function mockGetApi(path: Path, resolver: ResponseResolver<RestRequest, RestContext>) {
  msw.use(rest.get(path, resolver));
}

export const TestHelpers: {
  msw: SetupServer;
  mockGetApi: typeof mockGetApi;
} = {
  msw,
  mockGetApi,
};
