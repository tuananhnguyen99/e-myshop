import { useState, useEffect } from 'react';
import clsx from 'clsx';
import NumberFormat from 'react-number-format';
import userApi from '../../api/userApi';
import productApi from '../../api/productApi';
import ordersApi from '../../api/ordersApi';
import newsApi from '../../api/newsApi';
import Path from '../../components/Path';
import styles from './Admin.module.css';
import CardItem from './components/CardItem';
function Admin() {
    const [statistical, setStatistical] = useState({
        user: '...',
        product: '...',
        orders_success: '...',
        orders_cancel: '...',
        orders_turnover: '...',
        news: '...',
    });
    useEffect(() => {
        const userStatistical = async () => {
            const response = await userApi.statistical();
            if (response[0].error === 0) {
                setStatistical((state) => ({ ...state, user: response[0].statistical }));
            }
        };
        const productStatistical = async () => {
            const response = await productApi.statistical();
            if (response[0].error === 0) {
                setStatistical((state) => ({ ...state, product: response[0].statistical }));
            }
        };
        const orderStatistical = async () => {
            const response = await ordersApi.statistical();
            if (response[0].error === 0) {
                setStatistical((state) => ({
                    ...state,
                    orders_success: response[0].statistical_orders_success,
                    orders_cancel: response[0].statistical_orders_cancel,
                    orders_turnover: response[0].statistical_turnover,
                }));
            }
        };
        const newStatistical = async () => {
            const response = await newsApi.statistical();
            if (response[0].error === 0) {
                setStatistical((state) => ({ ...state, news: response[0].statistical }));
            }
        };
        userStatistical();
        productStatistical();
        orderStatistical();
        newStatistical();
    }, []);
    return (
        <>
            <Path adminPath />
            <div className={clsx(styles.wrapper)}>
                <div className={clsx(styles.listCard)}>
                    <CardItem
                        title="S???n ph???m ??ang b??n"
                        count={
                            <NumberFormat
                                value={statistical.product}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        }
                        to="/admin/san-pham"
                    />
                    <CardItem
                        title="????n h??ng ???? th??nh c??ng"
                        count={
                            <NumberFormat
                                value={statistical.orders_success}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        }
                        to="/admin/don-hang"
                    />
                    <CardItem
                        title="????n h??ng ???? ???? h???y"
                        count={
                            <NumberFormat
                                value={statistical.orders_cancel}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        }
                        to="/admin/don-hang"
                    />
                    <CardItem
                        title="T???ng doanh thu"
                        count={
                            <NumberFormat
                                value={statistical.orders_turnover}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix="&#8363;"
                            />
                        }
                        to="/admin/don-hang"
                    />
                    <CardItem
                        title="Ng?????i d??ng"
                        count={
                            <NumberFormat
                                value={statistical.user}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        }
                        to="/admin/nguoi-dung"
                    />
                    <CardItem
                        title="B??i vi???t tin t???c"
                        count={
                            <NumberFormat
                                value={statistical.news}
                                displayType={'text'}
                                thousandSeparator={true}
                            />
                        }
                        to="/admin/tin-tuc"
                    />
                </div>
            </div>
        </>
    );
}

export default Admin;
