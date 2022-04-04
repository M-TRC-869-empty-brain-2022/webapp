import styled from "styled-components";
import {Link} from "react-router-dom";

interface NotFoundProps {}

function NotFound(props: NotFoundProps) {
    return (<Styled404>
        <h1>404</h1>
        <Link to={'/'}>Go back home</Link>
    </Styled404>);
}

const Styled404 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  font-family: 'Courier New', Courier, monospace;
`

export default NotFound;