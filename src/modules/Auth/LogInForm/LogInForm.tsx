import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getUserToken, LogInData, UserLogInErrorDTO } from '../api';

import * as css from './styles.module.css';

export function LogInForm() {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState<string | null>(null);

  const createUserMutation = useMutation({
    mutationFn: getUserToken,
    onSuccess: async ({ user }) => {
      const { email, token, username, image } = user;

      localStorage.setItem('user-email', email);
      localStorage.setItem('user-username', username);
      localStorage.setItem('user-token', token);
      localStorage.setItem('user-image', image);

      navigate('/');
    },

    onError: (error: UserLogInErrorDTO) => {
      const errorMessage = error.errors
        ? Object.entries(error.errors)
            .map(([key, value]) => `${key} ${value}`)
            .join('. ')
        : 'An unknown error occurred';
      setServerErrors(errorMessage);
    },
  });

  const onFinish = async (values: LogInData) => {
    setServerErrors(null);
    createUserMutation.mutate(values);
  };

  return (
    <div className={css.modal}>
      <h2 className={css.title}>Log in</h2>

      {/* Error Alert */}
      {serverErrors && <Alert message="Registration Error" description={serverErrors} type="error" showIcon />}

      <Form name="login" className={css.form} onFinish={onFinish} layout="vertical">
        {/* Email */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="email"
          label="E-mail"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'The input is not valid E-mail!' },
          ]}
        >
          <Input placeholder="E-mail" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBlockEnd: 0 }}>
          <Button type="primary" htmlType="submit" block>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
