import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useValidateForm from '../../hook/useValidateForm';
import addressApi from '../../api/addressApi';
import userApi from '../../api/userApi';
import Path from '../../components/Path';
import { addNewToastMessage } from '../../redux/actions/toastMessage';
import styles from './Register.module.css';
import Button from '../../components/Button';
const Register = () => {
    const validates = [
        {
            name: 'name',
            rules: { isRequired: true, minLength: 6, maxLength: 30 },
        },
        {
            name: 'email',
            rules: { isRequired: true, isEmail: true },
        },
        {
            name: 'password',
            rules: { isRequired: true, minLength: 6, maxLength: 30 },
        },
        {
            name: 'phone',
            rules: { isRequired: true, isPhoneNumber: true },
        },
        {
            name: 'address',
            rules: { isRequired: true, minLength: 6, maxLength: 255 },
        },
        {
            name: 'city',
            rules: { isRequired: true },
        },
        {
            name: 'district',
            rules: { isRequired: true },
        },
        {
            name: 'commune',
            rules: { isRequired: true },
        },
    ];
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [cityList, setCityList] = useState([]);
    const [districtList, setDistrictList] = useState([]);
    const [communeList, setCommuneList] = useState([]);
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        city: '',
        district: '',
        commune: '',
    });
    useEffect(() => {
        const fetchCity = async () => {
            const response = await addressApi.getCity();
            setCityList(response);
        };
        fetchCity();
    }, []);
    useEffect(() => {
        if (values.city) {
            const fetchDistrict = async () => {
                const response = await addressApi.getDistrictByCityId(values.city);
                setDistrictList(response);
            };
            fetchDistrict();
        }
    }, [values.city]);
    useEffect(() => {
        if (values.district) {
            const fetchCommune = async () => {
                const response = await addressApi.getCommuneByDistrictId(values.district);
                setCommuneList(response);
            };
            fetchCommune();
        }
    }, [values.district]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = async () => {
        if (isLoading) {
            return;
        }
        const params = new FormData();
        params.append('_name', values.name);
        params.append('_email', values.email);
        params.append('_password', values.password);
        params.append('_phone', values.phone);
        params.append('_address', values.address);
        params.append('_city_id', values.city);
        params.append('_district_id', values.district);
        params.append('_commune_id', values.commune);
        setLoading(true);
        const response = await userApi.add(params);
        setLoading(false);
        if (response[0].error === 1) {
            return dispatch(addNewToastMessage('error', 'Th???t b???i', response[0].message));
        }
        dispatch(
            addNewToastMessage('success', 'Th??nh c??ng', '????ng k?? th??nh c??ng m???i b???n ????ng nh???p'),
        );
        navigate('/dang-nhap');
    };
    const { errors, removeError, formSubmit, invalid } = useValidateForm(validates, handleSubmit);
    const handleChange = (name, value) => {
        setValues({ ...values, [name]: value });
        removeError(name);
    };
    const handleChangeCity = (value) => {
        setValues({ ...values, city: value, district: '', commune: '' });
        removeError('city');
    };
    const handleChangeDistrict = (value) => {
        setValues({ ...values, district: value, commune: '' });
        removeError('district');
    };
    const checkLogin = useSelector((state) => state.auth.isAuthentication);
    if (checkLogin) {
        return <Navigate to="/" replace />;
    }
    const path = [
        {
            name: '????ng k??',
            url: '#',
        },
    ];
    return (
        <>
            <Path path={path} />
            <div className="container">
                <form className={clsx(styles.formRegister)} onSubmit={(e) => formSubmit(e, values)}>
                    <h2 className={clsx(styles.heading)}>????ng k?? t??i kho???n</h2>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.name })}>
                        <label>H??? v?? t??n: </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nh???p h??? v?? t??n"
                            onChange={(e) => handleChange('name', e.target.value)}
                            onBlur={(e) => invalid('name', e.target.value)}
                        />
                        {errors.name && (
                            <span className={clsx(styles.errorMessage)}>{errors.name}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.email })}>
                        <label>Email: </label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Nh???p email"
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={(e) => invalid('email', e.target.value)}
                        />
                        {errors.email && (
                            <span className={clsx(styles.errorMessage)}>{errors.email}</span>
                        )}
                    </div>
                    <div
                        className={clsx(styles.formGroup, styles.posRelative, {
                            [styles.invalid]: errors.password,
                        })}
                    >
                        <label>M???t kh???u: </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Nh???p m???t kh???u"
                            onChange={(e) => handleChange('password', e.target.value)}
                            onBlur={(e) => invalid('password', e.target.value)}
                        />
                        <i
                            className={`${showPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} eye`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                        {errors.password && (
                            <span className={clsx(styles.errorMessage)}>{errors.password}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.phone })}>
                        <label>S??? ??i???n th???ai: </label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Nh???p s??? ??i???n th???ai"
                            onChange={(e) => handleChange('phone', e.target.value)}
                            onBlur={(e) => invalid('phone', e.target.value)}
                        />
                        {errors.phone && (
                            <span className={clsx(styles.errorMessage)}>{errors.phone}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.address })}>
                        <label>?????a ch??? chi ti???t: </label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Nh???p ?????a ch??? chi ti???t"
                            onChange={(e) => handleChange('address', e.target.value)}
                            onBlur={(e) => invalid('address', e.target.value)}
                        />
                        {errors.address && (
                            <span className={clsx(styles.errorMessage)}>{errors.address}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.city })}>
                        <label>T???nh / Th??nh ph???</label>
                        <select
                            name="city"
                            onChange={(e) =>
                                handleChangeCity(
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                            onBlur={(e) =>
                                invalid(
                                    'city',
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                        >
                            <option value="">---Ch???n t???nh / th??nh ph???---</option>
                            {cityList.map((item) => (
                                <option key={item.city_id} value={item.city_id}>
                                    {item.city_name}
                                </option>
                            ))}
                        </select>
                        {errors.city && (
                            <span className={clsx(styles.errorMessage)}>{errors.city}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.district })}>
                        <label>Qu???n / Huy???n</label>
                        <select
                            name="district"
                            onChange={(e) =>
                                handleChangeDistrict(
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                            onBlur={(e) =>
                                invalid(
                                    'district',
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                        >
                            <option value="">---Ch???n qu???n / huy???n---</option>
                            {districtList.map((item) => (
                                <option key={item.district_id} value={item.district_id}>
                                    {item.district_name}
                                </option>
                            ))}
                        </select>
                        {errors.district && (
                            <span className={clsx(styles.errorMessage)}>{errors.district}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup, { [styles.invalid]: errors.commune })}>
                        <label>X?? / Ph?????ng / Th??? tr???n</label>
                        <select
                            name="commune"
                            onChange={(e) =>
                                handleChange(
                                    'commune',
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                            onBlur={(e) =>
                                invalid(
                                    'commune',
                                    e.target.options[e.target.options.selectedIndex].value,
                                )
                            }
                        >
                            <option value="">---Ch???n x?? / ph?????ng / th??? tr???n---</option>
                            {communeList.map((item) => (
                                <option key={item.commune_id} value={item.commune_id}>
                                    {item.commune_name}
                                </option>
                            ))}
                        </select>
                        {errors.commune && (
                            <span className={clsx(styles.errorMessage)}>{errors.commune}</span>
                        )}
                    </div>
                    <div className={clsx(styles.formGroup)}>
                        <Button loading={isLoading && '??ang ????ng k?? ...'} fullWidth primary>
                            <i className="fa fa-user-plus"></i>
                            ????ng k??
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Register;
