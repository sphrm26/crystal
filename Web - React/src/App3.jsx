import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const EventManager = lazy(() => import("./pages/EventManager/EventManager"));
const TaskManager = lazy(() => import("./pages/TaskManager/TaskManager"));
const Account = lazy(() => import("./pages/Account/Account"));
const FilesManager = lazy(() => import("./pages/FilesManager/FilesManager"));
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import SpinnerFullPage from "./component/spinnerFullpage/SpinnerFullPage";

const App3 = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage />}>
        <Routes>
          <Route index element={<EventManager />} />
          <Route path="eventManager" element={<EventManager />} />
          <Route path="taskManager" element={<TaskManager />} />
          <Route path="filesManager" element={<FilesManager />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App3;
