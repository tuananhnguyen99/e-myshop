import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import ordersApi from '../../../api/ordersApi';
import Path from '../../../components/Path';
import Actions from './Actions';
import ContentContainer from '../components/ContentContainer';
import TableContainer from '../components/TableContainer';
import Title from '../components/Title';
import Item from './Item';
import Loading from './Loading';
import Pagination from '../../../components/Pagination';
import Nodata from '../../../components/NoData';
import { addNewToastMessage } from '../../../redux/actions/toastMessage';
import View from './View';
function Orders() {
    const [isLoading, setLoading] = useState(true);
    const [isLoadingStatus, setLoadingStatus] = useState(true);
    const [orderList, setOrderList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [isShowView, setShowView] = useState(false);
    const [orderView, setOrderView] = useState('');
    const [params, setParams] = useState({
        id: '',
        statusId: '',
        limit: 10,
        page: 1,
        totalPage: '',
    });
    const timeoutRef = useRef(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchStatusOrders = async () => {
            const response = await ordersApi.showStatus();
            setLoadingStatus(false);
            setStatusList(response);
        };
        fetchStatusOrders();
        fetchOrders();
    }, []);
    const fetchOrders = async (id = '', statusId = '', limit = '', page = '') => {
        const data = {
            id,
            statusId,
            limit,
            page,
        };
        setLoading(true);
        const response = await ordersApi.search(data);
        setLoading(false);
        setOrderList(response.orderList);
        setParams({
            ...data,
            page: response.page,
            limit: response.limit,
            totalPage: response.totalPage,
        });
    };
    const handleChangeParams = (valueParams) => {
        setParams(valueParams);
        fetchOrders(valueParams.id, valueParams.statusId, valueParams.limit, valueParams.page);
    };
    const handleChangeInput = (valueParams) => {
        setParams(valueParams);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            fetchOrders(valueParams.id, valueParams.statusId, valueParams.limit, valueParams.page);
        }, 500);
    };
    const handleChangePage = async (valuePage) => {
        if (valuePage > 0 && valuePage <= params.totalPage && valuePage !== params.page) {
            fetchOrders(params.id, params.statusId, params.limit, valuePage);
        }
    };
    const handleChangeStatus = async (orderId, statusId) => {
        let next;
        if (statusId === '4') {
            next = window.confirm(
                `B???n c?? ch???c mu???n x??c nh???n ????n h??ng ${orderId} th??nh c??ng. S??? kh??ng ???????c thay ?????i l???i`,
            );
        } else if (statusId === '5') {
            next = window.confirm(
                `B???n c?? ch???c mu???n hu??? ????n h??ng ${orderId}. S??? kh??ng ???????c thay ?????i l???i`,
            );
        } else {
            next = window.confirm(`B???n c?? ch???c mu???n thay ?????i tr???ng th??i ????n h??ng ${orderId}`);
        }
        if (next) {
            const data = new FormData();
            data.append('_order_id', orderId);
            data.append('_status_id', statusId);
            const response = await ordersApi.changeStatus(data);
            if (response[0].error === 1) {
                return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
            }
            fetchOrders(params.id, params.statusId, params.limit, params.page);
            dispatch(addNewToastMessage('success', 'Th??nh c??ng', response[0].message));
        }
    };
    const handleAddNote = async (orderId) => {
        const note = window.prompt(`Ghi ch?? ????n h??ng "${orderId}"`);
        if (note.trim()) {
            const params = {
                id: orderId,
                note: note,
            };
            const response = await ordersApi.changeNote(params);
            if (response[0].error === 1) {
                return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
            }
            setOrderView('');
            dispatch(addNewToastMessage('success', 'Th??nh c??ng', response[0].message));
        }
    };
    const handleShowView = () => {
        setShowView(!isShowView);
    };
    const handleViewOrders = (orderId) => {
        setOrderView(orderId);
        handleShowView();
    };
    const path = [
        {
            name: 'Qu???n l?? ????n h??ng',
            url: '/admin/don-hang',
        },
    ];
    return (
        <>
            <Path path={path} adminPath />
            <View isShowView={isShowView} orderView={orderView} handleShowView={handleShowView} />
            <ContentContainer>
                <Title title="Danh s??ch ????n h??ng"></Title>
                <Actions
                    isLoadingStatus={isLoadingStatus}
                    params={params}
                    statusList={statusList}
                    handleChangeParams={handleChangeParams}
                    handleChangeInput={handleChangeInput}
                />
                <TableContainer>
                    <table>
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>T??n kh??ch h??ng</th>
                                <th>M?? ????n h??ng</th>
                                <th>T???ng ti???n</th>
                                <th>Tr???ng th??i</th>
                                <th>Ng??y t???o</th>
                                <th>H??nh ?????ng</th>
                            </tr>
                            {isLoading && <Loading count={params.limit} />}
                            {!isLoading &&
                                orderList.map((item, index) => (
                                    <Item
                                        key={item.order_id}
                                        stt={(params.page - 1) * params.limit + (index + 1)}
                                        item={item}
                                        statusList={statusList}
                                        handleChangeStatus={handleChangeStatus}
                                        handleAddNote={handleAddNote}
                                        handleViewOrders={handleViewOrders}
                                    />
                                ))}
                        </tbody>
                    </table>
                </TableContainer>
                {!isLoading && !orderList.length && <Nodata />}
                <Pagination
                    page={params.page}
                    totalPage={params.totalPage}
                    handleChangePage={handleChangePage}
                />
            </ContentContainer>
        </>
    );
}

export default Orders;
