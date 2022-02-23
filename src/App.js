import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Poll from "./components/Poll";
import NewPoll from "./components/NewPoll";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation();

  return (
    <div className="App">
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/newpoll" element={<NewPoll />} />
          <Route path="/poll/:id" element={<Poll />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
