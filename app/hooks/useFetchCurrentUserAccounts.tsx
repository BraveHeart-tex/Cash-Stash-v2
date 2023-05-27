import { UserAccount } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetchCurrentUserAccounts = () => {
  const [userAccounts, setUserAccounts] = useState<UserAccount[] | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUserAccounts = async () => {
      try {
        const res = await axios.get('/api/user/accounts');
        setUserAccounts(res.data.currentAccounts);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUserAccounts();
  }, []);

  return { userAccounts, isLoading };
};

export default useFetchCurrentUserAccounts;
