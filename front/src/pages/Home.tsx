import styled from 'styled-components';
import Header from '../components/Header';
import Todo from "src/components/MainView/Todo";
import Sidebar from "src/components/MainView/Sidebar";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {user} from "src/recoil/atom";
import {v4 as uuid} from "uuid";
import Api, { TodolistType } from "src/utils/api";
import {toast} from "react-toastify";

interface HomeProps {}

function Home(props: HomeProps) {
    const navigate = useNavigate();
    const auth = useRecoilValue(user);
    const [lists, setLists] = useState<TodolistType[] | undefined>(undefined);
    const { list } = useParams();

    useEffect(() => {
        const fetchLists = async () => {
            const lists = await Api.getUserTodoLists();

            try {
                setLists(lists);
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        fetchLists();
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