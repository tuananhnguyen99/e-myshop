import { Link } from 'react-router-dom';
import clsx from 'clsx';
import useSliceString from '../../../hook/useSliceString';
import Button from '../../../components/Button';
import noAvt from '../../../assets/img/icon/no-avatar.jpg';
import styles from './Rating.module.css';
function Item({ stt, item, isChangeStatus, handleSetDataRating, handleChangeStatus }) {
    return (
        <tr>
            <td>{stt}</td>
            <td>
                <div className={clsx(styles.infoCmt)}>
                    <div className={clsx(styles.avt)}>
                        <img
                            style={{ objectFit: 'cover' }}
                            src={item.user_avatar ? `${item.baseURLImg}${item.user_avatar}` : noAvt}
                            alt=""
                        />
                    </div>
                    <div className={clsx(styles.info)}>
                        <div>
                            <strong>{item.user_name}</strong>
                        </div>
                        <div className={clsx(styles.star, styles.mgt)}>
                            {Array(5)
                                .fill(0)
                                .map((i, index) => (
                                    <i
                                        key={index}
                                        className={clsx('fa fa-star', {
                                            [styles.color]: index < item.r_star,
                                        })}
                                    ></i>
                                ))}
                        </div>
                        <div className={clsx(styles.mgt)}>
                            <i>{item.r_created_at}</i>
                        </div>
                        <div className={clsx(styles.mgt)}>
                            <span>{useSliceString(item.r_content, 50)}</span>
                        </div>
                        <div className={clsx(styles.mgt)}>
                            <span>
                                {item.reply.length
                                    ? `( ???? c?? ${item.reply.length} c??u tr??? l???i )`
                                    : '( Ch??a c?? c??u tr??? l???i n??o )'}
                            </span>
                        </div>
                        <div className={clsx(styles.link, styles.mgt)}>
                            <Link to={`/product/${item.pro_id}`}>B??i vi???t g???c: click v??o ????y</Link>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                {item.admin_reply ? (
                    <Button notBtn success>
                        <i className="fa fa-check-square-o"></i>
                        ???? tr??? l???i
                    </Button>
                ) : (
                    <Button notBtn dark>
                        <i className="fa fa-info-circle"></i>
                        Ch??a tr??? l???i
                    </Button>
                )}
            </td>
            <td>
                {item.r_status === '0' ? (
                    <Button
                        dark
                        loading={isChangeStatus}
                        onClick={() => handleChangeStatus(item.r_id)}
                    >
                        <i className="fa fa-ban"></i>
                        Kh??ng
                    </Button>
                ) : (
                    <Button
                        success
                        loading={isChangeStatus}
                        onClick={() => handleChangeStatus(item.r_id)}
                    >
                        <i className="fa fa-check-square-o"></i>
                        C??
                    </Button>
                )}
            </td>
            <td data-type="action">
                <label onClick={() => handleSetDataRating(item)}>
                    <i className="fa fa-pencil-square-o"></i>
                    <span>Xem v?? b??nh lu???n</span>
                </label>
            </td>
        </tr>
    );
}

export default Item;
