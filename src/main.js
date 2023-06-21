import "./app.css";
import App from "./App.svelte";
import { pymChild } from "./pymDefine";

const el = document.getElementById("app");

const app = new App({
  target: el,
});

export default app;
