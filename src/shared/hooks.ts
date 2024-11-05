export const useGetUserLocalData = () => {
  return {
    email: localStorage.getItem('user-email'),
    username: localStorage.getItem('user-username'),
    token: localStorage.getItem('user-token'),
    image: localStorage.getItem('user-image'),
    isLoged: !!localStorage.getItem('user-token'),
  };
};

export const useLogOut = (navigate: (path: string) => void) => {
  return () => {
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-username');
    localStorage.removeItem('user-token');
    localStorage.removeItem('user-image');

    navigate('/');
  };
};
