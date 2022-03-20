import "./App.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Poll from "./components/Poll";
import NewPoll from "./components/NewPoll";
import AdminPoll from "./components/AdminPoll";
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation();

  return (
    <div className="App">
      <AnimatePresence exitBeforeEnter>
        <Routes location={location} key={location.pathname}>
          <Route exact path="/poll/:id/:adminLink" element={<AdminPoll />} />
          <Route exact path="/poll/:id" element={<Poll />} />
          <Route path="/newpoll" element={<NewPoll />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
