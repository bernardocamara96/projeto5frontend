import appLogo from "../../assets/logo.png";
import "./Header.css";

export default function Header() {
   return (
      <header>
         <a id="a-header" href="/">
            <img className="logo" src={appLogo} alt="IMG" />
            <h4>AgileFlow</h4>
         </a>
      </header>
   );
}
