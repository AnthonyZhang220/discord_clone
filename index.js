import React from 'react'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import App from './src/App.js';
import store from './src/redux/store.js';
import { Provider } from 'react-redux';


// if (process.env.NODE_ENV === 'development') {
//     whyDidYouRender(React, {
//         trackAllPureComponents: true,
//     });
// }

const container = document.getElementById('root')
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);
