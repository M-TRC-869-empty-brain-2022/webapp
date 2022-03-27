import styled from 'styled-components';
import Header from '../components/Header';
import {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import Api, {TodolistType} from "src/utils/api";

function useQuery() {
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);
}

function Result({ backgroundColor, ...res } : TodolistType & { backgroundColor: string }) {
    const navigate = useNavigate();

    return <StyledResult style={{ backgroundColor }} onClick={() => navigate(`/public/${res.id}`)}>
        <RName>{res.name}</RName>
        <RDesc>{res.description}</RDesc>
        <RUser>created by: @{res.user.username}</RUser>
    </StyledResult>
}

const StyledResult = styled.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;
`

const RName = styled.h4`
  margin: 0;
  margin-bottom: 10px;
`

const RUser = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #3f3f3f;
`

const RDesc = styled.p`
  margin: 0;
  padding: 0;
`

interface ResultsProps {
    results: TodolistType[];
}

function Results({ results }: ResultsProps) {
    return <StyledResults>
        { results.map((r, i) => <Result key={r.id} {...r} backgroundColor={i % 2 === 0 ? '#fafafa' : 'white'} />) }
    </StyledResults>
}

const StyledResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

function Search() {
    const query = useQuery();
    const q = useMemo(() => query.get("q"), [query]);
    const [results, setResults] = useState<TodolistType[] | undefined>(undefined);

    useEffect(() => {
        if (!q || q === '') {
            toast.error("Error on query");
            return;
        }

        const fetchResults = async () => {
            try {
                setResults(await Api.searchTodoLists({ name: q }));
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        fetchResults();
    }, [q])

    return (
        <StyledHome>
            <Header />
            <Interface>
                { !results && <div>loading...</div> }
                { results && results.length > 0 && <Results results={results} /> }
                { results && results.length === 0 && <div>No results</div> }
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
  padding: 30px;
`

export default Search;