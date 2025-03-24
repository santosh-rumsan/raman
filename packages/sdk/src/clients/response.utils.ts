import { AxiosResponse } from 'axios';

export type Response<T> = {
  success: boolean;
  data: T | null;
  code?: string;
  meta?: Record<string, any>;
};

export type ErrorResponse = {
  message: string;
  name: string;
  sourceModule: string | null;
  statusCode: number;
  success: boolean;
  timestamp: number;
  type: 'ERROR';
};

export type FormattedResponse<T> = {
  success: boolean;
  data: T;
  response: Response<T>;
  httpReponse: AxiosResponse;
};

export const formatResponse = <T>(
  response: AxiosResponse,
): FormattedResponse<T | ErrorResponse> => {
  if (!response.data?.success) {
    return {
      success: false,
      data: <ErrorResponse>response.data,
      response: <Response<ErrorResponse>>{
        success: false,
        data: response.data,
      },
      httpReponse: response,
    };
  }
  return {
    success: true,
    data: <T>response.data?.data,
    response: <Response<T>>response.data,
    httpReponse: response,
  };
};
