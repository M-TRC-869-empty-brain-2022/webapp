import styled from 'styled-components';
import Header from '../components/Header';
import Todo from "src/components/MainView/Todo";
import Sidebar from "src/components/MainView/Sidebar";
import {useEffect, useState} from "react";
import {TodoList} from "src/network/apiTypes";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {user} from "src/recoil/atom";
import {v4 as uuid} from "uuid";

interface HomeProps {}

function Home(props: HomeProps) {
    const navigate = useNavigate();
    const auth = useRecoilValue(user);
    const [lists, setLists] = useState<TodoList[] | undefined>(undefined);
    const { list } = useParams();

    useEffect(() => {
        const defaultList = () => ({ name: 'List', description: 'This is a description to the todo lol', id: uuid(), tasks: [] })

        setLists([
            defaultList(),
            { ...defaultList(), name: 'List2' },
            { ...defaultList(), name: 'List3' },
            { ...defaultList(), name: 'List4' },
            { ...defaultList(), name: 'List5' },
            { ...defaultList(), name: 'List6' },
            { ...defaultList(), name: 'List7' },
        ])
    }, [auth])

    return (
        <StyledHome >
            <Header />
            <Interface>
                <Sidebar lists={lists} setLists={setLists} onChange={(infos) => {
                    navigate(`/list/${infos.id}`)
                }} />
                {list && lists && <Todo {...lists.filter((a) => a.id === list)[0]} />}
            </Interface>
        </StyledHome>
    );
}

const StyledHome = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Interface = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`

export default Home;