import { UserAccount } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetchCurrentAccount = (id: string | null) => {
  const [currentAccount, setCurrentAccount] = useState<UserAccount | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAccount = async () => {
      try {
        const response = await axios.get(`/api/user/accounts/${id}`);
        setCurrentAccount(response.data.account);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCurrentAccount();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  return { currentAccount, isLoading };
};

export default useFetchCurrentAccount;
