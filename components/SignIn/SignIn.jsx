import React, { useState, useContext } from 'react';
import { Button } from 'antd'
import { useRouter } from 'next/router';
import FirebaseContext from '../firebase/context';
import { ROUTES, ACCOUNT_TYPE } from '../../constants';

const formattedname = name => {
  const parts = name.split(' ')
  const formattedParts = parts.map(part => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  })
  return formattedParts.join(' ')
}

function SignInPage(props) {
  const firebase = useContext(FirebaseContext);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter()
  const handleGoogleSignIn = () => {
    firebase
      .doGoogleSignIn()
      .then((authUser = {}) => {
        const { user: { displayName: fullName, email, photoURL: avatarUrl } = {} } = authUser;
        const name = formattedname(fullName)
        return firebase.user(authUser.user.uid).set({
          accountType: ACCOUNT_TYPE.FREE,
          fullName: name,
          email,
          avatarUrl,
        });
      })
      .then(() => {
        console.log('Authentication successful!')
        router.push(ROUTES.DASHBOARD)
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <h3>Sign In Page</h3>
      <Button type="primary" onClick={handleGoogleSignIn}>Sign In with Google </Button>
      {!!errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default SignInPage;
