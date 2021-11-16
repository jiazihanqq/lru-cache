import React from "react";
import "./App.css";
import { CacheRequset } from "./src";

const URL = 'https://images.dog.ceo/breeds/sheepdog-english/n02105641_1921.jpg';
function App() {
  // 进入控制台可以看到，相同的请求不会多次发送
  const cacheRequset = new CacheRequset(3);
  setInterval(()=>{
    cacheRequset.get(URL, '123');
  }, 2000);
  return <div className="App"></div>;
}

export default App;
