import styled from 'styled-components';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';
import {useRecoilValue} from "recoil";
import {user} from "src/recoil/atom";

interface BubbleProps {
    username: string;
}

function Bubble({ username }: BubbleProps) {
    const auth = useRecoilValue(user);

    console.log(auth)
    if (auth !== null && auth !== undefined)
    return <StyledBubble>
        <Link to={`/user/${username}`} style={{ textDecoration: 'none' }}>
            <Avatar />
        </Link>
    </StyledBubble>

    if (auth === null) {
        return <Link to={`/login`} style={{textDecoration: 'none', color: '#3d3d3d'}}><SignUp>Login / Sign Up</SignUp></Link>
    }

    return null;
}

const StyledBubble = styled.div`
    border-radius: 50%;
    overflow: hidden;
    width: 30px;
    height: 30px;
`

const SignUp = styled.div`
    padding: 10px;
  border-radius: 5px;
  border: 1px solid #3d3d3d;
`

export default Bubble;