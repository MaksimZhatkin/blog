// api.js

import { BASE_URL } from 'shared/queryClient';

export type UserData = {
  username: string;
  email: string;
  password: string;
};

export type LogInData = {
  email: UserData['email'];
  password: UserData['password'];
};

export type LogInRespDTO = {
  user: {
    email: string;
    username: string;
    token: string;
    image: string;
  };
};

export type UserResponseDTO = {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
};

export type UserEditResponseDTO = {
  token: string | null;
  user: {
    email: string;
    username: string;
    image: string | null;
    password: string | null;
  };
};

export type UserEditErrorDTO = {
  errors: Record<string, string>;
};

export type UserLogInErrorDTO = {
  errors: Record<string, string>;
};

export const createUser = async (userData: UserData): Promise<UserResponseDTO> => {
  const response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user: userData }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw responseData;
  }

  return responseData;
};

export const getUserToken = async ({ email, password }: LogInData): Promise<LogInRespDTO> => {
  const response = await fetch(`${BASE_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user: {
        email,
        password,
      },
    }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw responseData;
  }

  return responseData;
};

export const editUser = async ({ user: userEditedData, token }: UserEditResponseDTO) => {
  const response = await fetch(`${BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ user: userEditedData }),
  });
  const responseData = await response.json();

  if (!response.ok) {
    throw responseData;
  }

  return responseData;
};
