import React, { useEffect, useState } from 'react';
import Boards from '../../components/Boards';
import Main from '../../components/Main';
import Aside from '../../components/Aside';

const HomePage = ({ ...props }) => {
  return (
    <>
      <Aside />
      <Main>
        <Boards {...props} />
      </Main>
    </>
  );
};

export { HomePage };
