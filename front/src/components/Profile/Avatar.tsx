import styled from 'styled-components';

interface AvatarProps {
    username: string;
}

function Avatar({ username }: AvatarProps) {
    return <StyledAvatar>
        { username[0].toUpperCase() }
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
`

export default Avatar;