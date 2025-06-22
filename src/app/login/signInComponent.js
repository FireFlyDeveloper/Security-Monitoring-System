import useSignIn from 'react-auth-kit/hooks/useSignIn';

export default function SignInComponent() {
    const signIn = useSignIn();

    const onSubmit = (event) => {
        event.preventDefault();
        // Here you would typically handle the sign-in logic, e.g., calling an API
        // For demonstration, we'll just call signIn with dummy credentials
        signIn({
            token: 'dummy-token',
            expiresIn: 3600, // 1 hour
            tokenType: 'Bearer',
            authState: { user: 'dummyUser' },
        });
    };

    return (
        <div>
            <h1>Sign In</h1>
            <p>Please sign in to continue.</p>
        </div>
    );
}