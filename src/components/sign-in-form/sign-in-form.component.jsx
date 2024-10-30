import { useState, useContext } from 'react';
import {
  createUserDocumentFromAuth,
  signInAuthWithEmailAndPassword,
  signInWithGooglePopup,
} from '../../utils/firebase.utils';

import { UserContext } from '../../contexts/user.context';
import FormInput from '../form-input/form-input.component';
import Button from '../button/button.component';
import './sign-in-form.style.scss';

const defaultFields = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const [formFields, setFormFields] = useState(defaultFields);
  const { email, password } = formFields;

  const { setCurrentUser } = useContext(UserContext);
  const signInWithGoogle = async () => {
    const { user } = await signInWithGooglePopup();
    createUserDocumentFromAuth(user);
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    try {
      const { user } = await signInAuthWithEmailAndPassword(email, password);
      setCurrentUser(user);
      resetFormFields();
    } catch (error) {
      switch (error.code) {
        case 'auth/invalid-credentia':
          alert('Invalid email or password');
          break;
        default:
          console.log(error);
          break;
      }
    }
  };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const resetFormFields = () => {
    setFormFields(defaultFields);
  };

  return (
    <div className="sign-in-container">
      <h2>I already have an account</h2>
      <span>Signin with your email and password</span>
      <form onSubmit={handleOnSubmit}>
        <FormInput
          label="Email"
          type="email"
          name="email"
          onChange={handleOnChange}
          value={email}
          required
        />

        <FormInput
          label="Password"
          type="password"
          name="password"
          onChange={handleOnChange}
          value={password}
          required
        />
        <div className="buttons-container">
          <Button type="submit">Sign In</Button>
          <Button type="button" buttonType="google" onClick={signInWithGoogle}>
            Google sign in
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
