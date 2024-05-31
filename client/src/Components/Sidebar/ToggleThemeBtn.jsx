import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { Button } from "antd";

// eslint-disable-next-line react/prop-types
const ToggleThemeBtn = ({ darkTheme, toggleTheme }) => {
  return (
    <div className="toggle-theme-btn" >
      <Button onClick={toggleTheme}>
        {darkTheme ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </div>
  );
};

export default ToggleThemeBtn;
