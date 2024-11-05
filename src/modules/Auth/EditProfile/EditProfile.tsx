import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { useGetUserLocalData } from 'shared/hooks';

import { editUser, UserEditErrorDTO, UserEditResponseDTO } from '../api';

import * as css from './styles.module.css';

export function EditProfile() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { token, username, email, isLoged } = useGetUserLocalData();

  useEffect(() => {
    if (!isLoged) {
      navigate('/');
    }
  }, [isLoged]);

  const editUserMutation = useMutation({
    mutationFn: editUser,
    onSuccess: ({ user }) => {
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-username', user.username);
      localStorage.setItem('user-token', user.token);

      navigate('/profile');
    },

    onError: (error: UserEditErrorDTO) => {
      const fieldErrors = Object.entries(error.errors).map(([field, message]) => ({
        name: field,
        errors: [message],
      }));
      form.setFields(fieldErrors);
    },
  });

  const onFinish = (values: UserEditResponseDTO['user']) => {
    const responseVal = { user: values, token };
    editUserMutation.mutate(responseVal);
  };

  return (
    <div className={css.modal}>
      <h2 className={css.header}>Edit profile&apos;s data</h2>

      <Form
        form={form}
        name="signup"
        className={css.form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          username: username ?? undefined,
          email: email ?? undefined,
        }}
      >
        {/* Username */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Please input your username!' },
            { min: 3, max: 20, message: 'Username must be at least 3 characters' },
          ]}
        >
          <Input placeholder="Username" />
        </Form.Item>

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

        {/* New Password */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="new-password"
          label="New Password"
          rules={[
            { message: 'Please input your password!' },
            { min: 6, max: 40, message: 'Password needs to be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>

        {/* Avatar URL */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="image"
          label="Avatar image (URL)"
          rules={[{ message: 'Please input URL!' }, { type: 'url', message: 'The input is not valid url!' }]}
        >
          <Input placeholder="Image URL" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBlockEnd: 0 }}>
          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
