import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./src/App.js";
import store from "./src/redux/store.js";
import { Provider } from "react-redux";

// why-did-you-render removed — no dev instrumentation loaded here

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
    <BrowserRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </BrowserRouter>
);
