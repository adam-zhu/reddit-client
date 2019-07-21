import React from "react";

export default () => (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      left: 0
    }}
  >
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <progress
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%,-50%)"
        }}
      />
    </div>
  </div>
);
