import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light">
      <h1 className="text-3xl font-bold text-blue">Hello!</h1>

      <button
        onClick={() => setCount(count + 1)}
        className="mt-4 px-4 py-2 rounded-lg bg-btnBlue text-blue-500 shadow"
      >
        Clicked {count} times
      </button>
    </div>
  );
}

export default App;
