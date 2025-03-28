import classNames from './components.module.scss';

import display_small_logo from "../../../Assets/Image/logo_icon.png";
import display_logo_text from "../../../Assets/Image/logo_txt.png";

export const Logo = () => {
  return (
    <div className={classNames.logo}>
      <img
        src={display_small_logo}
        alt="logo icon"
        // style={{ marginTop: "12px" }}
      />
      <img
        src={display_logo_text}
        alt="logo"
        // style={{
          // maxHeight: "35px",
          // maxWidth: "180px",
          // marginTop: "12px",
        // }}
      />
    </div>
  );
};
