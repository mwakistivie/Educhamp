import React from 'react';
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import '../styles/ClerkAuth.css';

export default function ClerkAuth() {
  return (
    <div className="clerk-auth">
      <SignedOut>
        <div className="auth-buttons">
          <SignInButton mode="modal">
            <button className="signin-btn">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="signup-btn">Sign Up</button>
          </SignUpButton>
        </div>
      </SignedOut>
      
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
