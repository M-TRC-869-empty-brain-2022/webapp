import styled from 'styled-components';
import {AccessibilityOutline} from "react-ionicons";

interface AvatarProps {
    username?: string;
}

function Avatar({ }: AvatarProps) {
    return <StyledAvatar>
        <AccessibilityOutline
            color={'white'}
            height="100%"
            width="100%"
        />
    </StyledAvatar>
}

const StyledAvatar = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
    background-color: red;
  padding: 30%;
  box-sizing: border-box;
`

export default Avatar;