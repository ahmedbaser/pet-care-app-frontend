import { Provider } from 'react-redux';
import store from '../redux/store';
import { AppProps } from 'next/app';
import Navbar from '../components/Navbar'; 
import AdminNavbar from '../components/AdminNavbar';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; 
import { ToastContainer } from 'react-toastify';
import '../styles/globals.css';
import "antd/dist/reset.css"; 
import 'antd/dist/antd.css';


const MyApp = ({ Component, pageProps }: AppProps) => {
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
const user = useSelector((state: RootState) => state.auth.user);


 
return (
    <Provider store={store}>
      {isAuthenticated && user?.role === 'admin' ? <AdminNavbar /> : <Navbar />}
      <Component {...pageProps} />
      <ToastContainer />
    </Provider>
  );
};

export default MyApp;




