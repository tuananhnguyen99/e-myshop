import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ratingApi from '../../../api/ratingApi';
import Path from '../../../components/Path';
import Title from '../components/Title';
import ContentContainer from '../components/ContentContainer';
import TableContainer from '../components/TableContainer';
import Nodata from '../../../components/NoData';
import Pagination from '../../../components/Pagination';
import { addNewToastMessage } from '../../../redux/actions/toastMessage';
import Loading from './Loading';
import Item from './Item';
import Actions from './Actions';
import View from './View';
function Rating() {
    const [isLoading, setLoading] = useState(true);
    const [isChangeStatus, setChangeStatus] = useState(false);
    const [isViewRating, setViewRating] = useState(false);
    const [dataRating, setDataRating] = useState({});
    const [ratingList, setRatingList] = useState([]);
    const [params, setParams] = useState({
        page: 1,
        totalPage: '',
        limit: 10,
    });
    const dispatch = useDispatch();
    useEffect(() => {
        fetchRating();
    }, []);
    const fetchRating = async (page = '', limit = '') => {
        const data = {
            page,
            limit,
        };
        setLoading(true);
        const response = await ratingApi.showAll(data);
        setLoading(false);
        setRatingList(response.ratingList);
        setParams({ page: response.page, totalPage: response.totalPage, limit: response.limit });
    };
    const handleChangePage = async (valuePage) => {
        if (valuePage > 0 && valuePage <= params.totalPage && valuePage !== params.page) {
            fetchRating(valuePage, params.limit);
        }
    };
    const handleChangeParams = (data) => {
        setParams(data);
        fetchRating(data.page, data.limit);
    };
    const handleViewRating = () => {
        setViewRating(!isViewRating);
    };
    const handleSetDataRating = (data) => {
        setDataRating(data);
        handleViewRating();
    };
    const handleChangeStatus = async (id) => {
        setChangeStatus(true);
        const response = await ratingApi.changeStatus(id);
        setChangeStatus(false);
        if (response[0].error === 1) {
            return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
        }
        dispatch(addNewToastMessage('success', 'Th??nh c??ng', response[0].message));
        fetchRating(params.page, params.limit);
    };
    const path = [
        {
            name: 'Qu???n l?? ????nh gi??',
            url: '/admin/danh-gia',
        },
    ];
    return (
        <>
            <Path path={path} adminPath />
            <ContentContainer>
                {isViewRating && (
                    <View
                        dataRating={dataRating}
                        isViewRating={isViewRating}
                        handleViewRating={handleViewRating}
                        fetchRating={fetchRating}
                        params={params}
                    />
                )}

                <Title title="Danh s??ch ????nh gi??"></Title>
                <Actions params={params} handleChangeParams={handleChangeParams} />
                <TableContainer>
                    <table>
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th>Th??ng tin</th>
                                <th>Tr???ng th??i</th>
                                <th>Top ????nh gi??</th>
                                <th>H??nh ?????ng</th>
                            </tr>
                            {isLoading && <Loading count={params.limit} />}
                            {!isLoading &&
                                ratingList.map((item, index) => (
                                    <Item
                                        key={item.r_id}
                                        stt={(params.page - 1) * params.limit + (index + 1)}
                                        item={item}
                                        isChangeStatus={isChangeStatus}
                                        handleSetDataRating={handleSetDataRating}
                                        handleChangeStatus={handleChangeStatus}
                                    />
                                ))}
                        </tbody>
                    </table>
                </TableContainer>
                {!isLoading && !ratingList.length && <Nodata />}
                <Pagination
                    page={params.page}
                    totalPage={params.totalPage}
                    handleChangePage={handleChangePage}
                />
            </ContentContainer>
        </>
    );
}

export default Rating;
