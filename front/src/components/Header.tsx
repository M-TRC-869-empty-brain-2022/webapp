import styled from 'styled-components';
import Logo from './Logo';
import Bubble from './Profile/Bubble';
import { useRecoilValue } from 'recoil';
import { user } from '../recoil/atom';

interface HeaderProps {

}

function Header(props: HeaderProps) {
    const auth = useRecoilValue(user);

    return (
        <StyledHeader>
            <Logo />
            <Bubble username={auth?.username || 'error'} />
        </StyledHeader>
    );
}

const StyledHeader = styled.div`
    padding: 10px 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    background-color: white;
`

export default Header;