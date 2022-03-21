import styled from 'styled-components';
import Header from '../components/Header';

interface HomeProps {}

function Home(props: HomeProps) {
    return (
        <StyledHome>
            <Header />
        </StyledHome>
    );
}

const StyledHome = styled.div``

export default Home;