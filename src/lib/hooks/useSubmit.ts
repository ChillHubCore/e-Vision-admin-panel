import { useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { eAxios } from '../utils';
import { selectUserInfo } from '../redux/User/UserSlice';

/**
 * Custom hook for submitting requests.
 *
 * @returns An object containing the data, loading state, error, and a function to send the request.
 */
const useSubmit = <T>() => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const userInfo = useSelector(selectUserInfo);

  /**
   * Sends a request to the server.
   * @param requestQuery - The query string for the request.
   * @param body - The request body.
   * @param method - The HTTP method for the request.
   */
  const sendRequest = async (
    requestQuery: string,
    body: T,
    method: string,
    successMessage: string,
    errorMessage: string,
    onSuccess?: () => void // Optional argument for the function to run after success
  ) => {
    setIsLoading(true);
    try {
      const response = await eAxios.request({
        url: requestQuery,
        method,
        data: body,
        headers: {
          Authorization: `Bearer ${userInfo?.token || localStorage.getItem('access_token')}`,
        },
      });
      setData(response.data);
      setSuccess(true);
      toast.success(successMessage);
      if (onSuccess) {
        onSuccess(); // Run the function after success if provided
      }
      // Handle successful response
    } catch (err: AxiosError | any) {
      console.log(err as AxiosError);
      toast.error(errorMessage);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, sendRequest, success };
};

export default useSubmit;
