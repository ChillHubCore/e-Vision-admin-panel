import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const useUpload = () => {
  const [data, setData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<AxiosError>();
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';

  const sendFile = async (
    requestQuery: string,
    fileData: File,
    successMessage: string,
    errorMessage: string,
    onSuccess?: (url: string) => void // Optional argument for the function to run after success
  ) => {
    setIsLoading(true);
    const bodyFormData = new FormData();
    bodyFormData.append('file', fileData);
    try {
      const response = await axios.post(api + requestQuery, bodyFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      setData(response.data);
      setSuccess(true);
      toast.success(successMessage);
      if (onSuccess) {
        onSuccess(response.data); // Run the function after success if provided
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
  console.log('tracecode#uu32', data);
  return { data, isLoading, error, sendFile, success };
};

export default useUpload;
