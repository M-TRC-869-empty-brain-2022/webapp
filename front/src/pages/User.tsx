import { useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Body from '../components/Body';

function Logout() {
    const navigate = useNavigate();

    const onLogout = useCallback(() => {
        navigate('/login');
    }, [navigate]);
    
    return <StyledLogout onClick={onLogout}>
        Log-out
    </StyledLogout>
}

const StyledLogout = styled.div`
    cursor: pointer;
    padding: 10px 30px;
    border: 1px solid red;
    display: inline-block;
    border-radius: 5px;
    background-color: white;
    color: red;
`

interface UserProps {

}

function User(props: UserProps) {
    const { username } = useParams();

    return <StyledUser>
        <Header />
        <Body>
            <Username>{ username }</Username>
            <Logout />
        </Body>
    </StyledUser>
}

const StyledUser = styled.div``

const Username = styled.div``

export default User;