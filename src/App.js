import { useEffect, useState } from "react";
import { debounce as _debounce } from "lodash";

const logFortamt = (e, debounce, waitTime) => {
  const currentTime = new Date().toLocaleString();
  const type = e.type.toUpperCase();
  const timeStamp = e.timeStamp;
  const { innerWidth, innerHeight } = window;
  const debounceFomat = debounce ? `debounce waitTime=${waitTime}ms` : "";
  return `${currentTime} ${timeStamp} ${type} innerWidth=${innerWidth}px innerHeight=${innerHeight}px ${debounceFomat}`;
};

function App() {
  const [userAgent, setUserAgent] = useState();
  const [eventLogs, setEventLogs] = useState([]);
  const [debounce, setDebounce] = useState(false);
  const [waitTime, setWaitTime] = useState(1000);

  useEffect(() => {
    const toggleDebounce = (trueCallback, falseCallback, finallyCallback) => {
      debounce ? trueCallback() : falseCallback();
      finallyCallback && finallyCallback();
    };

    const logOutput = (e) => {
      setEventLogs((eventLogs) => [
        ...eventLogs,
        logFortamt(e, debounce, waitTime),
      ]);
      const element = document.getElementById("logs");
      const bottom = element.scrollHeight - element.clientHeight;
      element.scroll(0, bottom);
    };

    setUserAgent(window.navigator.userAgent);
    const debounceLogOutput = (e) => _debounce(logOutput, waitTime)(e);

    toggleDebounce(
      () => window.addEventListener("resize", debounceLogOutput),
      () => window.addEventListener("resize", logOutput),
      () => setUserAgent(window.navigator.userAgent)
    );
    return () => {
      toggleDebounce(
        () => window.removeEventListener("resize", debounceLogOutput),
        () => window.removeEventListener("resize", logOutput)
      );
    };
  }, [debounce, waitTime]);

  return (
    <div
      className="el-cover el-cover--space:0 panel"
      style={{ maxHeight: "100vh" }}
    >
      <header className="panel-header">
        <div className="panel-title">{userAgent}</div>
      </header>
      <div id="logs" className="el-cover__centered panel-body">
        <pre className="code" style={{ maxWidth: "none" }}>
          <code style={{ maxWidth: "none" }}>
            {eventLogs.map((eventLog, i) => (
              <span className="d-block" key={i}>
                {eventLog}
              </span>
            ))}
          </code>
        </pre>
      </div>
      <footer className="panel-footer">
        <div className="el-cluster el-cluster--justify:space-between">
          <div className="form-group ">
            <label className="form-switch">
              <input
                type="checkbox"
                checked={debounce}
                onChange={() => setDebounce(!debounce)}
              />
              <i className="form-icon"></i>debounce
            </label>
            <div className="input-group">
              <input
                type="number"
                className="form-input"
                placeholder="1000"
                disabled={!debounce}
                value={waitTime}
                step="1"
                min="0"
                onChange={(e) => setWaitTime(e.target.value)}
              />
              <span className="input-group-addon">ms</span>
            </div>
          </div>
          <button className="btn" onClick={() => setEventLogs(() => [])}>
            <i className="icon icon-delete"></i>
          </button>
        </div>
        <div className="el-center">
          <small>
            <a
              href="https://github.com/l1ck0h/window.event"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>{" "}
            / &copy; 2022 l1ck0h
          </small>
        </div>
      </footer>
    </div>
  );
}

export default App;
