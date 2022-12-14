import { useEffect, useRef, useState } from 'react';
import userApi from '../../../api/userApi';
import Path from '../../../components/Path';
import ContentContainer from '../components/ContentContainer';
import TableContainer from '../components/TableContainer';
import Title from '../components/Title';
import Actions from './Actions';
import Item from './Item';
import Loading from './Loading';
import Pagination from '../../../components/Pagination';
import Nodata from '../../../components/NoData';
import { addNewToastMessage } from '../../../redux/actions/toastMessage';
import { useDispatch } from 'react-redux';
function Users() {
    const [isLoading, setLoading] = useState(true);
    const [userList, setUserList] = useState([]);
    const [params, setParams] = useState({
        id: '',
        email: '',
        level: '',
        limit: 10,
        page: 1,
    });
    const timeoutRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        fetchUser();
    }, []);
    const fetchUser = async (email = '', level = '', limit = '', page = '') => {
        const data = {
            email,
            level,
            limit,
            page,
        };
        setLoading(true);
        const response = await userApi.getAll(data);
        setLoading(false);
        setParams({
            ...data,
            page: response.page,
            limit: response.limit,
            totalPage: response.totalPage,
        });
        setUserList(response.dataUser);
    };
    const handleChangeParams = (valueParams) => {
        setParams(valueParams);
        fetchUser(valueParams.email, valueParams.level, valueParams.limit, valueParams.page);
    };
    const handleChangeInput = (valueParams) => {
        setParams(valueParams);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            fetchUser(valueParams.email, valueParams.level, valueParams.limit, valueParams.page);
        }, 500);
    };
    const handleChangePage = async (valuePage) => {
        if (valuePage > 0 && valuePage <= params.totalPage && valuePage !== params.page) {
            fetchUser(params.email, params.level, params.limit, valuePage);
        }
    };
    const handleChangeLevelUser = async (userId, level, name) => {
        if (window.confirm(`B???n c?? ch???c mu???n thay ?????i ch???c v??? ng?????i d??ng " ${name} "`)) {
            const data = new FormData();
            data.append('_id', userId);
            data.append('_level', level);
            const response = await userApi.changeLevel(data);
            if (response[0].error === 1) {
                return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
            }
            fetchUser(params.email, params.level, params.limit, params.page);
            dispatch(addNewToastMessage('success', 'Th??nh c??ng', response[0].message));
        }
    };
    const handleChangeStatusUser = async (userId, name, status) => {
        if (window.confirm(`B???n c?? ch???c mu???n thay ?????i tr???ng th??i ng?????i d??ng " ${name} "`)) {
            const data = new FormData();
            data.append('_id', userId);
            data.append('_status', status);
            const response = await userApi.changeStatus(data);
            if (response[0].error === 1) {
                return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
            }
            fetchUser(params.email, params.level, params.limit, params.page);
            dispatch(addNewToastMessage('success', 'Th??nh c??ng', response[0].message));
        }
    };
    const handleDeleteUser = async (userId, name) => {
        if (window.confirm(`B???n c?? ch???c mu???n x??a ng?????i d??ng " ${name} "`)) {
            const response = await userApi.delete(userId);
            if (response[0].error === 1) {
                return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
            }
            fetchUser(params.email, params.level, params.limit, params.page);
            dispatch(addNewToastMessage('success', 'Th??nh c??ng', response[0].message));
        }
    };
    const path = [
        {
            name: 'Qu???n l?? ng?????i d??ng',
            url: '/admin/nguoi-dung',
        },
    ];
    return (
        <>
            <Path path={path} adminPath />
            <ContentContainer>
                <Title title="Danh s??ch ng?????i d??ng"></Title>
                <Actions
                    params={params}
                    handleChangeParams={handleChangeParams}
                    handleChangeInput={handleChangeInput}
                />
                <TableContainer>
                    <table>
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>T??n ng?????i d??ng</th>
                                <th>Email</th>
                                <th>S??? ??i???n tho???i</th>
                                <th>Ch???c v???</th>
                                <th>Tr???ng th??i</th>
                                <th>Ng??y t???o</th>
                                <th>H??nh ?????ng</th>
                            </tr>
                            {isLoading && <Loading count={params.limit} />}
                            {!isLoading &&
                                userList.map((item, index) => (
                                    <Item
                                        key={item.user_id}
                                        stt={(params.page - 1) * params.limit + (index + 1)}
                                        item={item}
                                        handleChangeLevelUser={handleChangeLevelUser}
                                        handleChangeStatusUser={handleChangeStatusUser}
                                        handleDeleteUser={handleDeleteUser}
                                    />
                                ))}
                        </tbody>
                    </table>
                </TableContainer>
                {!isLoading && !userList.length && <Nodata />}
                <Pagination
                    page={params.page}
                    totalPage={params.totalPage}
                    handleChangePage={handleChangePage}
                />
            </ContentContainer>
        </>
    );
}

export default Users;
