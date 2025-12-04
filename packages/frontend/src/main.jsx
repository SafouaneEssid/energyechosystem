import React from "react"
import { createRoot } from "react-dom/client"
function App(){ return <div style={{fontFamily:"sans-serif",padding:16}}><h1>Ecosystem — Frontend</h1><p>Dev server running</p></div> }
createRoot(document.getElementById("root")).render(<App/>)
