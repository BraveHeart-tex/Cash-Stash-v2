import { User } from '@prisma/client';
import axios from 'axios';
import { useEffect, useState } from 'react';

const useFetchCurrentUser = () => {
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('/api/user');
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return { user, isLoading };
};

export default useFetchCurrentUser;
