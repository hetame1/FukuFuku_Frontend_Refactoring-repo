import React, {useState} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import axios from 'axios';
import { Provider } from 'react-redux'
import { store } from './store'

axios.defaults.baseURL = 'http://localhost:3000'
axios.defaults.withCredentials = true

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import { themeState } from "./atom.ts";

const Root = () => {
  const [themeValue, setThemeValue] = useRecoilState(themeState);

  const theme = themeValue === true ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
    <RecoilRoot>
      <Root />
    </RecoilRoot>
  // </React.StrictMode>
)
