import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import NumberFormat from 'react-number-format';
import Button from '../../../../../components/Button';
import styles from './MainInfo.module.css';
function MainInfo({ data, handleUpdateStatus }) {
    const [imgList, setImgList] = useState([]);
    const [indexSlider, setIndexSlider] = useState(0);
    const [maxSlider, setmaxSlider] = useState(0);
    const [widthImg, setWidthImg] = useState(0);
    const imgRef = useRef(null);
    useEffect(() => {
        setWidthImg(imgRef.current.clientWidth);
        setImgList(data.pro_imgs ? JSON.parse(data.pro_imgs) : []);
        setmaxSlider(data.pro_imgs ? JSON.parse(data.pro_imgs).length : 0);
        setIndexSlider(0);
    }, [data.pro_imgs]);
    useEffect(() => {
        window.addEventListener('resize', () => setWidthImg(imgRef.current.clientWidth));
        return () =>
            window.removeEventListener('resize', () => setWidthImg(imgRef.current.clientWidth));
    }, []);
    useEffect(() => {
        let autoNextSlider = setInterval(() => {
            handleNextSlider();
        }, 4000);
        return () => {
            clearInterval(autoNextSlider);
        };
    }, [indexSlider, maxSlider]);
    const handleNextSlider = () => {
        if (indexSlider >= maxSlider) {
            setIndexSlider(0);
        } else {
            setIndexSlider(indexSlider + 1);
        }
    };
    const handlePrevSlider = () => {
        if (indexSlider <= 0) {
            setIndexSlider(maxSlider);
        } else {
            setIndexSlider(indexSlider - 1);
        }
    };
    return (
        <div className={clsx(styles.wrapper)}>
            <div ref={imgRef} className={clsx(styles.img)}>
                <button className={clsx(styles.btn, styles.prev)} onClick={handlePrevSlider}>
                    &lsaquo;
                </button>
                <button className={clsx(styles.btn, styles.next)} onClick={handleNextSlider}>
                    &rsaquo;
                </button>
                <div
                    className={clsx(styles.listImg)}
                    style={{
                        width: `${widthImg * (maxSlider + 1)}px`,
                        transform: `translateX(-${widthImg * indexSlider}px)`,
                    }}
                >
                    <img
                        style={{ width: `${widthImg}px`, height: `${widthImg / 1.2}px` }}
                        src={`${data.baseURLImg}${data.pro_img}`}
                        alt=""
                    />
                    {imgList.map((item, index) => (
                        <img
                            key={index}
                            style={{ width: `${widthImg}px`, height: `${widthImg / 1.3}px` }}
                            src={`${data.baseURLImg}${item}`}
                            alt=""
                        />
                    ))}
                </div>
            </div>
            <div className={clsx(styles.info)}>
                <ul>
                    <li>
                        <label>Danh m???c:</label>
                        <strong className={clsx(styles.textCategory)}>{data.cate_pro_name}</strong>
                    </li>
                    <li>
                        <label>T??n s???n ph???m:</label>
                        <strong className={clsx(styles.textName)}>{data.pro_name}</strong>
                    </li>
                    <li>
                        <label>Th????ng hi???u:</label>
                        <strong className={clsx(styles.textCategory)}>{data.brand_pro_name}</strong>
                    </li>
                    <li>
                        <label>Gi??:</label>
                        {data.pro_sale > 0 ? (
                            <>
                                <NumberFormat
                                    value={data.pro_price}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix="&#8363;"
                                    prefix=" "
                                />
                                <strike>
                                    <NumberFormat
                                        value={data.pro_cost}
                                        displayType={'text'}
                                        thousandSeparator={true}
                                        suffix="&#8363;"
                                        prefix=" "
                                    />
                                </strike>
                            </>
                        ) : (
                            <NumberFormat
                                value={data.pro_price}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix="&#8363;"
                                prefix=" "
                            />
                        )}
                    </li>
                    <li>
                        <label>sale:</label>
                        {data.pro_sale}%
                    </li>
                    <li>
                        <label>Tr???ng th??i:</label>
                        <select
                            onChange={(e) =>
                                handleUpdateStatus(
                                    data.pro_id,
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                            value={data.pro_status}
                        >
                            <option value="0">kh??ng ch???n</option>
                            <option value="1">M???i nh???t</option>
                            <option value="2">N???i b???t</option>
                        </select>
                    </li>
                    <li>
                        <label>S??? l?????ng:</label>
                        {data.pro_qty}
                    </li>
                    <li>
                        <label>T??nh tr???ng:</label>
                        {data.pro_qty > 0 ? (
                            <Button success small>
                                <i className="fa fa-check"></i>C??n h??ng
                            </Button>
                        ) : (
                            <Button danger small>
                                <i className="fa fa-times"></i>H???t h??ng
                            </Button>
                        )}
                    </li>
                    <li>
                        <label>???? b??n:</label> {data.pro_buyed}
                    </li>
                    <li>
                        <label>L?????t xem:</label> {data.pro_view}
                    </li>
                    <li>
                        <label>Ng??y t???o:</label>
                        {data.pro_created_at}
                    </li>
                    <li>
                        <label>Ng??y c???p nh???t:</label> {data.pro_updated_at}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MainInfo;
