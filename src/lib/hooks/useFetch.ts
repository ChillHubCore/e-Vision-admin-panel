import { useState, useEffect, useCallback } from 'react';
import { eAxios } from '@/lib/utils';

/**
 * Custom hook for fetching data from an API.
 *
 * @param {string} requestQuery - The API endpoint to fetch data from.
 * @param {object} params - Optional parameters to be sent with the request.
 * @returns {object} - An object containing the fetched data, loading state, error, and a refetch function.
 */
const useFetch = ({ requestQuery, params }: { requestQuery: string; params?: string }) => {
  // State variables to store the fetched data, loading state, and error

  const [data, setData] = useState<unknown>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>();
  const [status, setStatus] = useState<number>();

  // Function to fetch data from the API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Set the headers for the request
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        // response: 'json',
      };
      // Send a GET request to the API endpoint with the headers and optional parameters
      const response = await eAxios.get(requestQuery, {
        headers,
        params: params || {},
      });
      // Set the fetched data and update the loading state
      setData(response.data);
      setStatus(response.status);
      setIsLoading(false);
    } catch (err) {
      // Set the error and update the loading state in case of an error
      setError(err);
      setIsLoading(false);
    }
  }, [requestQuery, params]);

  // Fetch data when the component mounts and handle any errors
  useEffect(() => {
    let isMounted = true;

    fetchData().catch((err) => {
      if (isMounted) {
        setError(err);
        setIsLoading(false);
      }
    });

    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  // Function to refetch the data
  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchData();
  }, [fetchData]);

  // Return the fetched data, loading state, error, and refetch function as an object
  return { data, isLoading, error, refetch, status };
};

export default useFetch;
