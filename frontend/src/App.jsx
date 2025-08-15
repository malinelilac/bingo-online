import React, { useState } from "react";
import Home from "./pages/Home";
import Room from "./pages/Room";

export default function App() {
  const [session, setSession] = useState(null);

  if (!session) return <Home onJoin={setSession} />;
  return <Room session={session} />;
}
