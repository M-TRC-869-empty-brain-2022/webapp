import styled from 'styled-components';
import Header from '../components/Header';
import Todo from "src/components/MainView/Todo";
import Sidebar from "src/components/MainView/Sidebar";
import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {user} from "src/recoil/atom";
import Api, { TodolistType } from "src/utils/api";
import {toast} from "react-toastify";

interface HomeProps {
    publicList?: boolean;
}

function Home({ publicList }: HomeProps) {
    const navigate = useNavigate();
    const auth = useRecoilValue(user);
    const [lists, setLists] = useState<TodolistType[] | undefined>(undefined);
    const { list } = useParams();
    const [currentList, setCurrentList] = useState<TodolistType | undefined>(undefined);

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

        if (auth) {
            fetchLists();
        }
    }, [auth])

    useEffect(() => {
        const getList = async () => {
            try {
                const currentList = await Api.getTodoListById(list || '');

                setCurrentList(currentList);
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        if (list) {
            getList();
        }
    }, [list])

    return (
        <StyledHome>
            <Header />
            <Interface>
                {auth && <Sidebar lists={lists} setLists={setLists} onChange={(infos) => {
                    navigate(`/list/${infos.id}`)
                }} />}
                {currentList && <Todo setLists={setLists} {...currentList} publicList={publicList} />}
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