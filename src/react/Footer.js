import React from 'react';

const Footer = () => {
  return(
    <footer className="footer">
      <div className="footer__title">- Just a portfolio project -</div>
      <ul className="footer__meta">
        <li><span className="footer__label">data api</span> <a href="http://api.population.io/">http://api.population.io/</a></li>
        <li><span className="footer__label">frameworks</span> <a href="https://reactjs.org/">react.js</a> | <a href="http://www.chartjs.org/">charts.js</a> / <a href="https://www.npmjs.com/package/react-chartjs-2">react-chartjs-2</a></li>
        <li><span className="footer__label">tools</span> <a href="https://webpack.js.org/">webpack</a> | <a href="https://sass-lang.com/">sass</a></li>
        <li><span className="footer__label">sourcecode</span> <a href="https://github.com/peterlidee/charts">gitHub</a></li>
        <li><span className="footer__label">contact</span> <a href="mailto:peter@lidee.be">peter@lidee.be</a></li>
      </ul>

    </footer>
  );
}

export default Footer;
