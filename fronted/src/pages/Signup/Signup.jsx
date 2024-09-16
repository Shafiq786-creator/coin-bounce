import { useFormik } from 'formik';
import { useState } from 'react';
import Textinput from '../../components/Textinput/Textinput';
import styles from './Signup.module.css'
import signupSchema from '../../schemas/signupSchema';
import { setUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {signup} from '../../api/internal'

//signup

function Signup(){
    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    const [error, setError] = useState('');

    const handleSinup = async () => {
        const data = {
            name : values.name,
            username : values.username,
            email : values.email,
            password : values.password,
            confirmPassword : values.confirmPassword
        };

         try {
            const response = await signup(data);

            if(response.status === 201){
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
        }
            catch (error) {
                if (error.response && error.response.status === 409) {
                    // Display conflict error (e.g., duplicate username/email)
                    setError('Username or email already exists.');
                } else if (error.response && error.response.data.errorMessage) {
                    // Set other error messages returned from the server
                    setError(error.response.data.errorMessage);
                } else {
                    // General error handling
                    setError('An error occurred during signup. Please try again.');
                }
            }
         }     
    

    const {values, touched, handleBlur, handleChange, errors} = useFormik({
        initialValues : {
            name : "",
            username : "",
            email : "",
            password : "",
            confirmPassword : ""
        },

        validationSchema : signupSchema
    });

    return (
        <div className={styles.signuprap}>
            <div className={styles.signupheader}>Create an account</div>
            <Textinput
             type = "text"
             value = {values.name}
             name = "name"
             onBlur = {handleBlur}
             onChange = {handleChange}
             placeholder = "name"
             error = {errors.name && touched.name ? 1 : undefined}
             errormessage = {errors.name}
             />

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
             type = "text"
             value = {values.email}
             name = "email"
             onBlur = {handleBlur}
             onChange = {handleChange}
             placeholder = "email"
             error = {errors.email && touched.email ? 1 : undefined}
             errormessage = {errors.email}
             />

            <Textinput
              type = "password"
              value = {values.password}
              name = "password"
              onBlur = {handleBlur}
              onChange = {handleChange}
              placeholder = "password"
              error = {errors.password&& touched.password ? 1 : undefined}
              errormessage = {errors.password}
             />

            <Textinput
              type = "password"
              value = {values.confirmPassword}
              name = "confirmPassword"
              onBlur = {handleBlur}
              onChange = {handleChange}
              placeholder = "confirmPassword"
              error = {errors.confirmPassword&& touched.confirmPassword ? 1 : undefined}
              errormessage = {errors.confirmPassword}
             />

             <button
              className={styles.signupButton} onClick={handleSinup}>
                Sign Up
            </button>

            <span>
                Already have an account? 
                <button 
                className={styles.loginButton}
                onClick={() => navigate('/login')}
                >
                    Log In
                </button>
            </span>
            <p className={styles.errormessage}>{error}</p> 

        </div>
    )

}
export default Signup;