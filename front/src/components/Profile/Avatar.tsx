import styled from 'styled-components';
import {AccessibilityOutline} from "react-ionicons";
import {useRecoilValue} from "recoil";
import { user } from "src/recoil/atom";

function Avatar() {
    const auth = useRecoilValue(user);

    return <Container>
        {auth?.profilePicture ? (
            <StyledProfilePicture src={auth?.profilePicture} />
        ) : (
            <StyledAvatar>
                <AccessibilityOutline
                    color={'white'}
                    height="100%"
                    width="100%"
                />
            </StyledAvatar>
        )}
    </Container>
}


const StyledProfilePicture = styled.img`
    width: 100%;
    height: 100%;
`

const Container = styled.div`
    width: 100%;
  height: 100%;
`

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