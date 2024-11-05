/* eslint-disable */
import { fileURLToPath } from 'url';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env) => {
  const isDev = env.mode === 'development';
  const isProd = env.mode === 'production';

  return {
    stats: 'errors-warnings',
    mode: env.mode ?? 'development',
    devtool: isDev ? 'eval' : 'source-map',
    entry: './src/main.tsx',
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'public'),
      clean: true,
    },
    resolve: {
      extensions: ['.jsx', '.js', '.ts', '.tsx'],
      alias: {
        app: path.resolve(__dirname, 'src/app/'),
        pages: path.resolve(__dirname, 'src/pages/'),
        widgets: path.resolve(__dirname, 'src/widgets/'),
        features: path.resolve(__dirname, 'src/features/'),
        modules: path.resolve(__dirname, 'src/modules/'),
        entities: path.resolve(__dirname, 'src/entities/'),
        shared: path.resolve(__dirname, 'src/shared/'),
        assets: path.resolve(__dirname, 'src/assets/'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        },
        {
          test: /\.css$/,
          oneOf: [
            {
              test: /\.module\.css$/,
              use: [
                isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                {
                  loader: 'css-loader',
                  options: {
                    modules: {
                      localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64]',
                    },
                    importLoaders: 1,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [
                        [
                          'postcss-preset-env',
                          {
                            browsers: ['last 2 versions', 'Firefox ESR', 'not OperaMini All', 'not dead'],
                          },
                        ],
                        ['autoprefixer', {}],
                      ],
                    },
                  },
                },
              ],
            },
            {
              use: [
                isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
                'css-loader',
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      plugins: [
                        [
                          'postcss-preset-env',
                          {
                            browsers: ['last 2 versions', 'Firefox ESR', 'not OperaMini All', 'not dead'],
                          },
                        ],
                        ['autoprefixer', {}],
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src', 'template.html'),
        filename: 'index.html',
        inject: 'body',
      }),
      isProd &&
        new MiniCssExtractPlugin({
          filename: 'styles.[contenthash].css',
          ignoreOrder: true,
        }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src', 'assets', 'img'),
            to: path.resolve(__dirname, 'public', 'img'),
          },
        ],
      }),
    ].filter(Boolean),
    optimization: {
      minimize: true,
      minimizer: [new CssMinimizerPlugin({}), new TerserPlugin()],
      splitChunks: false,
      runtimeChunk: false,
    },
    performance: {
      hints: false,
    },
    devServer: {
      static: './public',
      port: 3000,
      hot: true,
    },
  };
};
