import { ApiVersions } from '../enums';

const usersRoot = 'users';

export const routesV1 = {
  version: ApiVersions.V1,
  users: {
    root: usersRoot,
    delete: `:id`,
  },
};
