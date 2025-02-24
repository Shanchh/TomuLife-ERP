import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ConfigProvider } from 'antd';
import zhTW from "antd/lib/locale/zh_TW";
import dayjs from "dayjs";

dayjs.locale("zh-tw");

const theme = {
  token: {
    colorPrimary: '#ff710c',
    colorInfo: '#faad14',
    colorWarning: '#fadb14',
    wireframe: false,
  },
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ConfigProvider theme={theme} locale={zhTW}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);