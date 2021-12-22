import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearErrors } from '../../actions/userActions'

const Register = ({ history }) => {

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })



    const { name, email, password } = user;

    const [avatar, setAvatar] = useState('')
    const [emailError, setEmailError] = useState('')
    const [nameError, setNameError] = useState('')
    const [avatarError, setAvatarError] = useState('')
    const [passError, setPassError] = useState('')
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history])

    const checkValidate = () => {
        var check = true;
        if(email === '' || email === null || email === undefined){
            setEmailError('Email is required');
            check = false
        }
        if(email.length > 0){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const mailError = re.test(email);

        if (mailError === false) {
            setEmailError('Invalid email');
            check = false
        }
        if (mailError === true) {
            setEmailError('')
        }
        }
        if (name === '' || name === null || name === undefined) {
            setNameError('Name is required')
            check = false
        }

        if (name.length > 0) {
            setNameError('')
        }

        if (avatar === '') {
            setAvatarError('Avatar is required')
            check = false
        }

        if (avatar !== '') {
            setAvatarError('')
        }

        if (password.length < 8 || password === '' || password === undefined || password === null) {
            setPassError('Password must contain at least 8 characters')
            check = false
        }

        if (password.length >= 8) {
            setPassError('')
        }

        return check;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (checkValidate() === true) {
            //Sub check validate
            const formData = new FormData();
            formData.set('name', name);
            formData.set('email', email);
            formData.set('password', password);
            formData.set('avatar', avatar);

            dispatch(register(formData))
        }
    }

    const onChange = e => {
        if (e.target.name === 'avatar') {
            if (e.target.files[0].size > 1 * 1024 * 1024) {
                alert.error(`The allowed file size is 1MB. The file you are trying to upload is of ${(e.target.files[0].size / (1024 * 1024)).toFixed(2)}`)
            }
            else {
                const reader = new FileReader();

                reader.onload = () => {
                    if (reader.readyState === 2) {
                        setAvatarPreview(reader.result)
                        setAvatar(reader.result)
                    }
                }

                reader.readAsDataURL(e.target.files[0])
            }


        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>

            <MetaData title={'Register User'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name * <label className='text-danger'>{nameError}</label></label>
                            <input
                                type="name"
                                id="name_field"
                                className="form-control"
                                name='name'
                                value={name}
                                onChange={onChange}
                                style={{ borderColor: `${nameError !== '' ? 'red' : ''}`}}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email * <label className='text-danger'>{emailError}</label></label>
                            <input
                                // type="email"
                                id="email_field"
                                className="form-control"
                                name='email'
                                value={email}
                                onChange={onChange}
                                style={{ borderColor: `${emailError !== '' ? 'red' : ''}`}}

                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password_field">Password * <label className='text-danger'>{passError}</label></label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                name='password'
                                value={password}
                                onChange={onChange}
                                style={{ borderColor: `${passError !== '' ? 'red' : ''}`}}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar * <label className='text-danger'>{avatarError}</label></label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                        style={{ cursor: 'pointer'}}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false}
                        >
                            REGISTER
                        </button>
                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default Register
