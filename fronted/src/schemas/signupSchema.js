import * as yup from 'yup';

const passwordPattern =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,25}$/

const erroMessage = 'user lowercase, uppercase and digits';
const signupSchema = yup.object().shape({
    name: yup.string().max(30).required('name is required'),
    username: yup.string().min(5).max(30).required('username is required'),
    email: yup.string().email('Enter a valid email').required('email is required'),
    password: yup.string().min(8).max(25).matches(passwordPattern,{message: erroMessage}).required('password is required'),
    confirmPassword: yup.string().oneOf([yup.ref('password')],'password must be same').required('password is required')
});

export default signupSchema;