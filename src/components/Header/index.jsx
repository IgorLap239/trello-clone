import React from 'react';
import { Auth, Typography, Button } from '@supabase/ui';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/Auth';

import './header.css';
import { SearchBar } from '../SearchBar';

const basicStyles = {
  color: '#fff',
  margin: '0 10px 0 10px',
};

export const Header = () => {
  const { signOut, user, authState, userProfile } = useAuth();

  return (
    <header className="header">
      <nav className="header__nav nav__button">
        <Link
          to="/"
          className="nav_button__more"
          aria-label="More"
          role="button"
        />
        <Link to="/" className="nav_button__trello">
          Crello
        </Link>
        <div className="nav__button__sign-in">
          {userProfile()?.aud === 'authenticated' ? (
            <>
              <Link to="/profile" style={basicStyles}>
                Profile
              </Link>

              <Link to="/protected" style={basicStyles}>
                Dashboard
              </Link>
            </>
          ) : null}

          {userProfile()?.aud !== 'authenticated' ? (
            <Link to="/sign-in" style={basicStyles}>
              Sign In
            </Link>
          ) : (
            <Button block onClick={() => signOut()}>
              Sign out
            </Button>
          )}
        </div>
      </nav>
      <SearchBar />
    </header>
  );
};
