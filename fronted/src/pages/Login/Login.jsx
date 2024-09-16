import { useFormik } from 'formik';
import Textinput from '../../components/Textinput/Textinput';
import styles from './Login.module.css'
import loginSchema from '../../schemas/loginSchema';
import { login } from '../../api/internal';
import {setUser} from '../../store/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const [error, setError] = useState('')

    const handleLogin = async () => {
        const data = {
              username: values.username,
              password: values.password    
    };
     try {
        const response = await login(data);

        if(response.status === 200){
            //1. setUser
            const user = {
                _id : response.data.user._id,
                email : response.data.user.email,
                username : response.data.user.username,
                auth : response.data.auth
            };

            dispatch(setUser(user));
            //2.redirect -> homepage

            navigate('/');
        }
        else if (response.code ==='ERR_BAD_REQUEST'){
            //display error message
            setError(response.response.data.message);
        }
     } catch (error) {
        console.error('Login failed:', error);
        setError('Username or Password is incorrect. Please try again.');
     }
       
    };

   const {values, touched, handleBlur, handleChange, errors} = useFormik({
      initialValues : {
               password : '',
               username : '',
      },

      validationSchema : loginSchema,
    
   });

    return (
        <div className={styles.loginrap}>
            <div className={styles.loginheader}>Log in to your account</div>
            <Textinput
             type = "text"
             value = {values.username}
             name = "username"
             onBlur = {handleBlur}
             onChange = {handleChange}
             placeholder = "username"
             error = {errors.username && touched.username ? 1 : undefined}
             errormessage = {errors.username}
            />
            <Textinput 
               type = "password"
               value = {values.password}
               name = "password"
               onBlur = {handleBlur}
               onChange = {handleChange}
               placeholder = "password"
               error = {errors.password && touched.password ? 1 : undefined}
               errormessage = {errors.password}
            />
            <div className={styles.bottom}>
            <button
             
             className={styles.logInButton}
             onClick={handleLogin}
             disabled={
                !values.username ||
                !values.password ||
                errors.username ||
                errors.password
              }
      
              >
                log In
                </button>
            <span>
                Don't have an account?
                 <button
                  className={styles.registerButton}
                  onClick={() => navigate('/signup')}
             >Register
             </button>
             </span>
             {error !== '' ? <p className={styles.errormessage}>{error}</p> : ''}
            </div>
        </div>
    );
}

export default Login;