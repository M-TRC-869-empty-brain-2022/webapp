import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Logo({ noRedirect }: { noRedirect?: boolean }) {
    return <Link to={`/`} style={{ textDecoration: 'none', display: 'inline-block', pointerEvents: noRedirect ? 'none' : 'initial' }}><StyledLogo>empty-brain</StyledLogo></Link>
}

const StyledLogo = styled.div`
    padding: 10px 10px;
    background-color: #FC58AA;
    font-weight: bold;
    box-sizing: border-box;
    font-family: 'Courier New', Courier, monospace;
    color: white;
    display: inline-block;
    align-items: center;
`

export default Logo;