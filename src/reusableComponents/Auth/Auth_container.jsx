import "./index.css";

import Logo from "../Logo";

const Auth_container = ({ children }) => {
  return (
    <div className="page-over">
      <section className="login__section">
        <div className="login__right__container">
          <div className="login__right__sub__container">
            <Logo />
          </div>
        </div>
        <div className="login__left">{children}</div>
      </section>
    </div>
  );
};

export default Auth_container;
