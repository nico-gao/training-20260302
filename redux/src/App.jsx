import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import useFetch from "../hooks/useFetch";

const url = "http://qweqwe.com";

function App({ name }) {
  const [count, setCount] = useState(0);

  const { data, loading, error } = useFetch(url);

  if (loading) {
    return <h3>Loading data...</h3>;
  }

  if (error) {
    return <h3>There is an error!</h3>;
  }

  return (
    <div>
      {!loading &&
        data?.todos.map((todo) => <li key={todo.id}>{todo.todo}</li>)}
    </div>
  );
}

export default App;
// export default  withAuth(withName(App));

// const withAuth = (WrappedComponent) => {
//   return (props) => {
//     const isAuthenticated = localStorage.getItem('token'); // Simple auth check
//     const name = "alice";

//     if (!isAuthenticated) {
//       // Redirect to login if not authenticated
//       return <Navigate to="/login" />;
//     }

//     // Return the original component with its props if authenticated
//     return <WrappedComponent {...props} isAuthenticated={isAuthenticated} name={name} />;
//   };
// };

// export default withAuth;

// const withName = (WrappedComponent) => {
//   return (props) => {

//     const name = "bob";

//     // Return the original component with its props if authenticated
//     return <WrappedComponent {...props} isAuthenticated={isAuthenticated} name={name} />;
//   };
// };

// export default withName;
