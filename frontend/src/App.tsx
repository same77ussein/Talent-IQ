import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

function App() {
  return (
    <>
      <p className="brand">InterviewCall</p>

      <Show when="signed-out">
        <SignInButton mode="modal">Sign in</SignInButton>
        <SignUpButton mode="modal">Create account</SignUpButton>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}

export default App;
