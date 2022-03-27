import styled from "styled-components";
import {useCallback, useEffect, useState} from "react";
import { IoTrashOutline, IoCopyOutline } from 'react-icons/io5'
import { MdPublic, MdPublicOff } from 'react-icons/md'
import Api, {TaskType, Progress, TodolistType} from "src/utils/api";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

const progresses = {
    TODO: {
        name: 'todo',
        color: '#03c2fc',
    },
    IN_PROGRESS: {
        name: 'doing',
        color: '#e8cd33',
    },
    DONE: {
        name: 'done',
        color: '#336ce8',
    }
}

interface ProgressViewProps {
    name: string,
    id: string,
    progress: Progress,
    setTasks: React.Dispatch<React.SetStateAction<TaskType[] | undefined>>;
    publicList?: boolean;
}

function ProgressView({ name, id, progress, setTasks, publicList }: ProgressViewProps) {
    return <StyledProgress
        style={{ backgroundColor: progresses[progress].color, cursor: publicList ? 'default' : 'pointer' }}
        onClick={async () => {
            if (publicList) return;

            let next: Progress;

            switch (progress) {
                case "TODO":
                    next = "IN_PROGRESS";
                    break;
                case "IN_PROGRESS":
                    next = "DONE";
                    break;
                case "DONE":
                    next = "TODO";
                    break;
                default:
                    next = "TODO";
                    break;
            }

            await Api.updateTask(id, { name, progress: next })

            setTasks((old) => old?.map(t => {
                if (t.id !== id)
                    return t;
                t.progress = next;
                return t;
            }));
        }}
    >
        {progresses[progress].name}
    </StyledProgress>
}

const StyledProgress = styled.div`
  padding: 3px 10px;
  color: white;
  border-radius: 15px;
  display: flex;
  align-items: center;
  user-select: none;
`

interface TaskViewProps {
    task: TaskType;
    setTasks: React.Dispatch<React.SetStateAction<TaskType[] | undefined>>;
    publicList?: boolean;
}

function TaskView({ task: { id, name, progress }, setTasks, publicList }: TaskViewProps) {
    const onClick = useCallback(() => {
        const deleteTask = async () => {
            try {
                await Api.deleteTask(id);

                setTasks((old) => old?.filter((t) => t.id !== id));
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        deleteTask();
    }, [id, setTasks]);

    return <StyledTask>
        <TaskTitle>{name}</TaskTitle>
        <ProgressView id={id} progress={progress} name={name} setTasks={setTasks} publicList={publicList} />
        {!publicList && <IoTrashOutline
            color={'#00000'}
            onClick={onClick}
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
        />}
    </StyledTask>
}

const StyledTask = styled.div`
  padding: 10px 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e3e3e3;
  
  > *:not(:last-child) {
    margin-right: 15px;
  }
`

const TaskTitle = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`

function getProgressPercent(tasks: TaskType[] | undefined) {
    if (!tasks || tasks.length === 0) {
        return 0;
    }
    return Math.floor((tasks.reduce((acc, c) => acc + (c.progress === 'DONE' ? 1 : 0), 0) / tasks.length) * 100)
}

interface TodoProps extends TodolistType {
    setLists:  React.Dispatch<React.SetStateAction<TodolistType[] | undefined>>;
    publicList?: boolean;
}

function Todo({ id, name, description, shared, setLists, publicList }: TodoProps) {
    const [tasks, setTasks] = useState<TaskType[] | undefined>(undefined);
    const [_shared, setShared] = useState(shared);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const list = await (publicList ?  Api.getPublicTodoListById :  Api.getTodoListById)(id);

            try {
                setTasks(list.tasks.reverse());
            } catch (e) {
                // @ts-ignore
                toast.error(e.message);
            }
        }

        fetchTasks();
    }, [id, publicList]);

    const addTask = useCallback(() => {
        const name = prompt('Task name:');

        if (name) {
            const createTask = async () => {
                try {
                    const task = await Api.createTask(id, {name});

                    setTasks((old) => [task, ...(old || [])])
                } catch (e) {
                    // @ts-ignore
                    toast.error(e.message);
                }
            }

            createTask();
        }
    }, [id])

    const deleteTodo = useCallback(async () => {
        try {
            await Api.deleteTodoList(id);

            setLists((old) => old?.filter(l => l.id !== id));
            navigate('/');
        } catch (e) {
            // @ts-ignore
            toast.error(e.message);
        }
    }, [id, navigate, setLists])

    const shareTodo = useCallback(async () => {
        try {
            await Api.updateTodoList(id, { name, description, shared: !_shared });

            setShared(!_shared);
        } catch (e) {
            // @ts-ignore
            toast.error(e.message);
        }
    }, [id, name, description, _shared])

    return <StyledTodo>
        <TodoHeader>
            <TodoMeta>
                <TodoTitle>{ !_shared ? <MdPublicOff style={{ width: '20px' }}  /> : <MdPublic style={{ width: '20px' }} /> } <div style={{ width: '15px', display: 'inline-block' }} /> {name}</TodoTitle>
                <TodoDescription>{description}</TodoDescription>
                <TodoInfos>
                    <TodoProgress>
                        { !tasks ?
                            ( 'Loading...' ) :
                            ( tasks.length === 0 ? (
                                    'No tasks'
                                ) : (
                                    `${getProgressPercent(tasks)}% done ${ getProgressPercent(tasks) === 100 ? '🎉' : ''}`
                                )
                            )
                        }
                    </TodoProgress>
                </TodoInfos>
            </TodoMeta>
            {!publicList && <TodoAction>
                <IoTrashOutline
                    color={'red'}
                    onClick={deleteTodo}
                    style={{ cursor: 'pointer', width: '25px', height: '25px' }}
                />
                <ShareButton onClick={shareTodo}>
                    { !_shared ? <MdPublicOff /> : <MdPublic /> }
                    <div style={{ width: '5px' }} />
                    { !_shared ? 'Make public' : 'Make private' }
                </ShareButton>
                {_shared && <CopyPublicList
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.hostname}/public/${id}`);
                        toast("Public link copied on clipboard");
                    }}>
                    <IoCopyOutline
                        color={'#00000'}
                        height="15px"
                        width="15px"
                        style={{ marginRight: '10px' }}
                    />
                    Copy public link
                </CopyPublicList>}
            </TodoAction>}
        </TodoHeader>
        {!publicList && <AddButtonContainer>
            <AddButton onClick={addTask}>
                New task +
            </AddButton>
        </AddButtonContainer>}
        {tasks && tasks.length !== 0 && tasks.map((task) => <TaskView key={task.id} task={task} setTasks={setTasks} publicList={publicList} />)}
    </StyledTodo>
}

const StyledTodo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 30px;
`

const TodoTitle = styled.h1`
    margin-top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const TodoDescription = styled.p`
`

const TodoHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 15px;
`
const TodoMeta = styled.div``
const TodoAction = styled.div`
    display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const AddButtonContainer = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: start;
`

const AddButton = styled.div`
  padding: 5px 10px;
  box-sizing: border-box;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  background-color: #31902c;
  user-select: none;
  cursor: pointer;
  color: white;
  border-radius: 5px;
`

const TodoInfos = styled.div`
`

const TodoProgress = styled.div`
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
`

const ShareButton = styled.div`
  cursor: pointer;
  padding: 10px;
  text-align: center;
  border: 1px solid black;
  border-radius: 5px;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CopyPublicList = styled.div`
  cursor: pointer;
  padding: 10px;
  text-align: center;
  border: 1px solid black;
  border-radius: 5px;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export default Todo;