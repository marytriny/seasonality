// Import CSS
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// Import packages
import { StrictMode } from 'react';
import { ToastContainer } from 'react-toastify';

// Local imports
import Main from './components/Main';

function App() {
  return (
    <div>
      <StrictMode>
        <Main />
      </StrictMode>

      {/* Toast pop-up configuration */}
      <ToastContainer
        position='bottom-left'
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme='colored'
      />
    </div>
  );
}

export default App;
