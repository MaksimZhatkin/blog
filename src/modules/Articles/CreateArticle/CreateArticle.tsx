/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { useGetUserLocalData } from 'shared/hooks';

import { NewArticleResponse, postArticle } from '../api';

import * as css from './styles.module.css';

export function CreateArticle() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { token, isLoged } = useGetUserLocalData();

  const createNewArticleMutation = useMutation({
    mutationFn: postArticle,
    onSuccess: () => {
      form.resetFields();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const onFinish = async (values: NewArticleResponse['article']) => {
    const data = { article: { ...values }, token: token ?? '' };
    createNewArticleMutation.mutate(data);
  };

  useEffect(() => {
    if (!isLoged) {
      navigate('/login');
    }
  }, [isLoged]);

  return (
    <article className={css.article}>
      <header className={css.header}>
        <h2 className={css.title}>Create new article</h2>
      </header>
      <main>
        <Form form={form} name="create_article" onFinish={onFinish} layout="vertical">
          {/* Title */}
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter the main topic' }]}>
            <Input placeholder="Title" />
          </Form.Item>
          {/* Short Description */}
          <Form.Item
            name="description"
            label="Short description"
            rules={[{ required: true, max: 250, message: 'Description cannot exceed 250 characters' }]}
          >
            <Input placeholder="Short description" />
          </Form.Item>
          {/* Text Area for Article Content */}
          <Form.Item
            name="body"
            label="Text"
            rules={[{ required: true, message: 'Please write your article content' }]}
          >
            <Input.TextArea
              placeholder="Write an article. You can use Markdown syntax!"
              spellCheck
              autoSize={{ minRows: 8 }}
            />
          </Form.Item>
          {/* Tags Input */}
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label>
            <div className={css.tag_label}>Tags</div>
            <Form.List name="tagList">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        style={{ marginBottom: 2 }}
                        name={[name]}
                        key={key}
                        rules={[{ required: true, message: 'Please enter a tag' }]}
                      >
                        <Input placeholder="Tag topic" />
                      </Form.Item>
                      <Button type="primary" danger onClick={() => remove(name)} icon={<MinusCircleOutlined />}>
                        Delete
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} style={{ width: '100%' }}>
                      Add tag
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </label>
          {/* Submit Button */}
          <Form.Item>
            <Button type="primary" htmlType="submit" className={css.submit_button}>
              Send
            </Button>
          </Form.Item>
        </Form>
      </main>
    </article>
  );
}
