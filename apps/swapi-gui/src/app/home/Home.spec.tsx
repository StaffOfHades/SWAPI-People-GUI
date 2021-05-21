import { MemoryRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';

import Home from './Home';

describe('Home', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Router>
        <Home />
      </Router>
    );
    expect(baseElement).toBeTruthy();
  });
});
