export class ApiRoutes {
  private static SERVER_URL = 'http://localhost:3333/api';

  // User
  public static LOGIN = `${ApiRoutes.SERVER_URL}/auth/login`;
  public static USER = `${ApiRoutes.SERVER_URL}/auth/me`;
}
