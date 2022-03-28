import styled from 'styled-components';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import {useRecoilValue} from "recoil";
import {user} from "src/recoil/atom";
import {IoSettingsSharp} from "react-icons/io5";

function Bubble() {
    const auth = useRecoilValue(user);

    if (auth !== null && auth !== undefined)
    return <StyledBubbleContainer>
        {auth.role === 'ADMIN' && <Link to={`/admin`} style={{ textDecoration: 'none' }}>
            <AdminSettings>
                <IoSettingsSharp color={"#ffffff"} title={"settings"} height="20px" width="20px" />
            </AdminSettings>
        </Link>}
        <StyledBubble>
            <Link to={`/user/me`} style={{ textDecoration: 'none' }}>
                <Avatar />
            </Link>
        </StyledBubble>
    </StyledBubbleContainer>

    if (auth === null) {
        return <SignUpContainer>
            <Link to={`/login`} style={{textDecoration: 'none', color: '#3d3d3d'}}><SignUp>Login / Sign Up</SignUp></Link>
        </SignUpContainer>
    }

    return null;
}

const StyledBubbleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`

const StyledBubble = styled.div`
    border-radius: 50%;
    overflow: hidden;
    width: 30px;
    height: 30px;
`

const SignUpContainer = styled.div`
    display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
`

const SignUp = styled.div`
    padding: 10px;
  border-radius: 5px;
  border: 1px solid #3d3d3d;
`

const AdminSettings = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  background-color: #3d3d3d;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
`

export default Bubble;