export type SafeErrorResponse = {
  statusCode: number;
  error: {
    code: string;
    message: string;
  };
  requestId: string;
  timestamp: string;
};
