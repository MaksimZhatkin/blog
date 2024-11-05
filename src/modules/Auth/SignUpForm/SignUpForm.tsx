import React from 'react';
import { Form, Input, Checkbox, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { createUser, UserData, UserLogInErrorDTO } from '../api';

import * as css from './styles.module.css';

export function SignUpForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      const { email, token, username } = data.user;

      localStorage.setItem('user-email', email);
      localStorage.setItem('user-username', username);
      localStorage.setItem('user-token', token);

      navigate('/');
    },

    onError: (error: UserLogInErrorDTO) => {
      const fieldErrors = Object.entries(error.errors).map(([field, message]) => ({
        name: field,
        errors: [message],
      }));
      form.setFields(fieldErrors);
    },
  });

  const onFinish = async (values: UserData) => {
    createUserMutation.mutate(values);
  };

  return (
    <div className={css.modal}>
      <h2 className={css.header}>Create new account</h2>

      <Form name="signup" className={css.form} onFinish={onFinish} layout="vertical" form={form}>
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

        {/* Password */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, max: 40, message: 'Password needs to be at least 6 characters' },
          ]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        {/* Repeat Password */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="confirmPassword"
          label="Repeat Password"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords must match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Repeat Password" />
        </Form.Item>

        {/* Checkbox for Agreement */}
        <Form.Item
          style={{ marginBlockEnd: 0 }}
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('You must agree to the terms')),
            },
          ]}
        >
          <Checkbox>I agree to the processing of my personal information</Checkbox>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBlockEnd: 0 }}>
          <Button type="primary" htmlType="submit" block>
            Create
          </Button>
        </Form.Item>
      </Form>

      <p>
        Already have an account?{' '}
        <Link className="" to="/login">
          Sign In
        </Link>
        .
      </p>
    </div>
  );
}
