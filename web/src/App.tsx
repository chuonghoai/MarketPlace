import { ToastProvider } from "./components/toast/toast";
import AppRoutes from "./routes";

function App() {
  return (
    <ToastProvider>
        <AppRoutes />
    </ToastProvider>
  );
}

export default App;