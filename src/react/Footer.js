import React from 'react';

const Footer = () => {
  return(
    <footer className="footer">
      <div className="footer__title">Population statistics of different European countries - A portfolio project -</div>
      <ul className="footer__meta">
        <li>
          <span className="footer__label">data api</span>
          <a href="http://api.population.io/" target="_blank">http://api.population.io</a>
        </li>
        <li><span className="footer__label">frameworks</span>
          <a href="https://reactjs.org/" target="_blank">react.js</a>
          |
          <a href="https://www.npmjs.com/package/react-router-dom" target="_blank">react-router-dom</a>
          |
          <a href="http://www.chartjs.org/" target="_blank">charts.js</a>
          /
          <a href="https://www.npmjs.com/package/react-chartjs-2" target="_blank">react-chartjs-2</a>
        </li>
        <li><span className="footer__label">tools</span>
          <a href="https://webpack.js.org/" target="_blank">webpack</a>
          |
          <a href="https://sass-lang.com/" target="_blank">sass</a>
        </li>
        <li><span className="footer__label">sourcecode</span> <a href="https://github.com/peterlidee/charts" target="_blank">gitHub</a></li>
        <li><span className="footer__label">contact</span> <a href="mailto:peter@lidee.be">peter@lidee.be</a></li>
      </ul>

    </footer>
  );
}

export default Footer;
