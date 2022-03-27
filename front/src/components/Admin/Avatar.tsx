import styled from "styled-components";
import { SettingsSharp } from "react-ionicons";

function Avatar() {
  return (
    <StyledAvatar>
      <SettingsSharp color={"#ffffff"} title={"settings"} height="20px" width="20px" />
    </StyledAvatar>
  );
}

const StyledAvatar = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: red;
`;

export default Avatar;
