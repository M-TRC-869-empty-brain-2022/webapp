import styled from 'styled-components';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

interface BubbleProps {
    username: string;
}

function Bubble({ username }: BubbleProps) {
    return <StyledBubble>
        <Link to={`/user/${username}`} style={{ textDecoration: 'none' }}>
            <Avatar username={username} />
        </Link>
    </StyledBubble>
}

const StyledBubble = styled.div`
    border-radius: 50%;
    overflow: hidden;
    width: 30px;
    height: 30px;
`

export default Bubble;