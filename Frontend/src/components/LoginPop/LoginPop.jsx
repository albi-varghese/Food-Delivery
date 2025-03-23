import { useContext, useState } from 'react';
import './LoginPop.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const LoginPop = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    const url = currState === 'Sign Up' ? '/api/user/register' : '/api/user/login';

    try {
      const response = await axios.post(`http://localhost:4001${url}`, data);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        toast.success(response.data.message, { autoClose: 2000 });

        setTimeout(() => {
          if (currState === 'Sign Up') {
            setCurrState('Login');
            setData({ name: '', email: '', password: '' });
          } else {
            setShowLogin(false);
          }
        }, 2000);
      } else {
        toast.error(response.data.message, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error('Server error. Please try again.', { autoClose: 2000 });
    }
  };

  return (
    <div className="login-popup">
      <ToastContainer position="top-right" />
      
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        <div className="login-popup-inputs">
          {currState === 'Login' ? null : (
            <input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder="Your Name" required />
          )}
          <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Your Email" required />
          <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder="Your Password" required />
        </div>

        <button type="submit">{currState === 'Sign Up' ? 'Create Account' : 'Login'}</button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>

        {currState === 'Login' ? (
          <p>
            Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account? <span onClick={() => setCurrState('Login')}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPop;
