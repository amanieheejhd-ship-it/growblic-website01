export type ApiSuccessResponse = {
  success: true;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type FieldErrors<Field extends string> = Partial<Record<Field, string>>;

export type ValidationErrorResponse<Field extends string = string> =
  ApiErrorResponse & {
    fieldErrors?: FieldErrors<Field>;
  };

export type FormSubmissionResponse = ApiSuccessResponse | ApiErrorResponse;
