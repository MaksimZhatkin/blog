/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useGetUserLocalData } from 'shared/hooks';
import { invalidateAppQuery } from 'shared/queryClient';

import { Article, getArticleQueryOptions, postArticle, updateArticle, UpdateArticleResponse } from '../api';

import * as css from './styles.module.css';

export function ArticleForm({ slug = null }: { slug?: Article['slug'] | null }) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { token, isLoged } = useGetUserLocalData();
  const isEditing = !!slug;
  const {
    data: article,
    error,
    isLoading,
  } = useQuery(isEditing ? getArticleQueryOptions(slug) : { queryKey: [], enabled: false });

  const updateArticleMutation = useMutation({
    mutationFn: updateArticle,
    onSuccess: () => {
      invalidateAppQuery(['article', slug]);
      navigate(-1);
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: postArticle,
    onSuccess: () => {
      form.resetFields();
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });

  const onFinish = (articleValues: UpdateArticleResponse['article']) => {
    const mutationData = {
      token: token ?? '',
      slug: isEditing ? slug ?? '' : '',
      article: { ...articleValues },
    };

    if (isEditing) {
      updateArticleMutation.mutate(mutationData);
    } else {
      createArticleMutation.mutate(mutationData);
    }
  };

  useEffect(() => {
    if (!isLoged) {
      navigate('/login');
    }
  }, [isLoged, navigate]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong!</p>;
  }

  return (
    <article className={css.article}>
      <header className={css.header}>
        <h2 className={css.title}>{isEditing ? 'Edit article' : 'Create new article'}</h2>
      </header>
      <main>
        <Form
          form={form}
          name="create_article"
          onFinish={onFinish}
          layout="vertical"
          initialValues={
            article
              ? {
                  title: article.title ?? '',
                  description: article.description ?? '',
                  body: article.body ?? '',
                  tagList: article.tagList ?? [],
                }
              : {}
          }
        >
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
              {isEditing ? 'Edit' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </main>
    </article>
  );
}
