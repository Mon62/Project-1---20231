import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./Layout/DefaultLayout.js";
import GlobalStyles from "./GlobalStyles";
import { ToastContainer } from "react-toastify";
function App() {
  return (

    <div>
      <Router>
        <Routes>

          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            if (route.layout) {
              Layout = route.layout;
            }

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <ToastContainer autoClose={3000} hideProgressBar position="bottom-center" />
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>

  );
}

export default App;
