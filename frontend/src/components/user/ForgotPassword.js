import React, { Fragment, useState, useEffect } from 'react'

import MetaData from '../layout/MetaData'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword, clearErrors } from '../../actions/userActions'

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, loading, message } = useSelector(state => state.forgotPassword)

    useEffect(() => {

        if (error) {
            if (error === 'User not found with this email') {
                setEmailError(error);
            }
            else {
                alert.error(error);
                dispatch(clearErrors());
            }

        }

        if (message) {
            alert.success(message)
        }

    }, [dispatch, alert, error, message])

    const checkValidate = () => {
        var check = true;
        if (email === '' || email === undefined || email === null) {
            setEmailError('Email is required');
            check = false
        }
        if (email.length > 0) {
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

        return check;
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (checkValidate() === true) {
            const formData = new FormData();
            formData.set('email', email);

            dispatch(forgotPassword(formData))
        }

    }

    return (
        <Fragment>
            <MetaData title={'Forgot Password'} />

            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email <label className='text-danger pl-2'>{emailError}</label></label>
                            <input
                                // type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={loading ? true : false} >
                            Send Email
                        </button>

                    </form>
                </div>
            </div>

        </Fragment>
    )
}

export default ForgotPassword
