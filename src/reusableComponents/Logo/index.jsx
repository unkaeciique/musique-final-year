import "./index.css";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useNavigate } from "react-router-dom";
import images from "../../assets/images/images";
import { Scale } from "@mui/icons-material";

const Logo = ({ ml, type = "anchor" }) => {
  const navigate = useNavigate();
  return (
    <p
      id="dummygram-logo"
      style={{ marginLeft: ml ? ml : "20px" }}
      onClick={() => {
        if (type === "anchor") {
          if (
            !location.href.includes("login") &&
            !location.href.includes("signup")
          ) {
            navigate("/");
          }
        }
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }}
    >
      {/* <AutoAwesomeIcon className="" />
      musique */}
      <img
        src={images.darkLogo}
        style={{ transform: "scale(0.6)", padding: "0", marginLeft: "0" }}
      />
    </p>
  );
};

export default Logo;
