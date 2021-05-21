import { Link } from 'react-router-dom';
import React, { FunctionComponent } from 'react';

import styles from './Home.module.scss';

export interface HomeProps {
  className: string;
}

export const Home: FunctionComponent<HomeProps> = ({ className }) => {
  return (
    <div className={className}>
      <h1>Browse information about the StarWars Cinematic Universe</h1>
      <ul className={styles['Home-quick-access-list']}>
        <li>
          <Link className={styles['Home-link']} to="/people">
            People & Characters
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
