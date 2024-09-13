import { RequestContext } from 'nestjs-request-context';

export class AppRequestContext extends RequestContext {
  requestId: string;
  transactionConnection?: string; // For global transactions
}

export class RequestContextService {
  static getContext(): AppRequestContext {
    return RequestContext.currentContext.req;
  }

  static setRequestId(id: string): void {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static getTransactionConnection(): string | undefined {
    const ctx = this.getContext();
    return ctx.transactionConnection;
  }

  static setTransactionConnection(connection?: string): void {
    const ctx = this.getContext();
    ctx.transactionConnection = connection;
  }

  static cleanTransactionConnection(): void {
    const ctx = this.getContext();
    ctx.transactionConnection = undefined;
  }
}
