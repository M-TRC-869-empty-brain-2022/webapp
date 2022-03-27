import styled from 'styled-components';
import Logo from './Logo';
import Bubble from './Profile/Bubble';
import { useRecoilValue } from 'recoil';
import { user } from '../recoil/atom';
import {useCallback, useState} from "react";
import {SearchOutline} from "react-ionicons";
import {useNavigate} from "react-router-dom";

interface HeaderProps {

}

function SearchBar() {
    const navigate = useNavigate();
    const [s, setS] = useState('');

    const onSubmit = useCallback((e) => {
        e.preventDefault();

        navigate(`/search?q=${s}`)
    }, [navigate, s])

    return <StyledSearchBar onSubmit={onSubmit}>
        <StyledSearchInput placeholder={'search in public todo lists...'} onChange={(e) => setS(e.target.value)} />
        <SubmitSearch>
            <SearchOutline width={"15px"} height={"15px"} color={"#000000"} />
        </SubmitSearch>
    </StyledSearchBar>
}

const StyledSearchBar = styled.form`
  display: flex;
  flex-direction: row;
  flex: 0.5;
  border: 1px solid #757575;
`

const StyledSearchInput = styled.input`
  padding: 7px 20px;
  flex: 1;
  border: none;
  outline: none;
`
const SubmitSearch = styled.button`
  height: 100%;
  padding: 10px;
  background: none;
  border: none;
`

function Header(props: HeaderProps) {
    const auth = useRecoilValue(user);

    return (
        <StyledHeader>
            <Logo />
            <SearchBar />
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
    border-bottom: 1px solid #e3e3e3;
`

export default Header;