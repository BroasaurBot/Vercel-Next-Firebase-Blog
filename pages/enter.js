import { auth, googleAuthProvider } from '../lib/firebase';
import { useContext, useEffect, useCallback, useState } from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';
import { firestore } from '../lib/firebase';

export default function EnterPage(props) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ?
        !username ? <UsernameForm /> : <SignedIn crid={{user, username}}/> 
        :
        <SignInButton />
        }
    </main>
  )
};

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={'/google.png'} /> Sign in with Google
    </button>
  )
}

function SignedIn(props) {
  return (
  <>
    <p>
      Logged in as: <span className='font-bold'>{props.crid.username}  </span>
    </p> 
    <h1 className='my-5'>Welcome <span className='text-red-500'>
      {props.crid.user.displayName} </span>
    </h1>
  </>
  )
}

function UsernameForm() {

  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);


  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]); 

  const onChange = (e) => {
    //Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();

    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length <= 3) {
      setFormValue(val);
      setIsValid(false);
      setLoading(false);
    } else if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce (async (username) => {
    if (username.length > 3) {
      const ref = firestore.doc(`usernames/${username}`);
      const { exists } = await ref.get();
      console.log('Firestore read executed!');
      setIsValid(!exists);
      setLoading(false);
    }
  }, 500)
  )

  const onSubmit = async (e) => {
    e.preventDefault(); 

    console.log("Form submitted!, " , formValue) ;

    try {
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${formValue}`);

      const batch = firestore.batch();
      batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName});
      batch.set(usernameDoc, { uid: user.uid});

      await batch.commit();

    } catch (error) {
      console.log(error);
    }
  }

  function UsernameMessage({username, isValid, loading}) {
    if (loading) {
      return <p> Checking.... </p>
    } else if (isValid) {
      return <p className='text-green-500'> {username} is available! </p>
    }else if (username && !isValid) {
      return <p className='text-red-500'> That username is taken! </p>
    }else {
      return <p></p> 
    }
  }

  const dynamicBorder = () => {
    let border = `border-solid border-x-0 border-t-0 border-b-5`;
    if (loading) {
      return ` ${border} border-yellow-300`;
    } else if (isValid) {
      return `${border} border-green-300`;
    } else if (formValue && !isValid) {
      return `${border} border-red-300`;
    } else {
      return `${border} border-gray-300`;
    }
  }

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input className={`${dynamicBorder()}`}
           name="username" placeholder="username" value={formValue} onChange={onChange} />

          <div className='flex flex-row justify-start items-center mb-10'>
            <button type="submit" className="btn-green" disabled={!isValid}> 
              Choose
            </button>
            <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
          </div>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  )
}