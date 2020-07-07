import React, { useState } from 'react';
import Base from '../core/Base';
import { Link, Redirect, Router } from 'react-router-dom';
import { signin, authenticate, isAuthenticate } from '../auth/helper';


const Signin = () => {

    const [values, setValues] = useState({
        error: "",
        password: "",
        email: "",
        loading: false,
        didRedirect: false
    });

    const { email, password, error, loading, didRedirect } = values;
    const { user } = isAuthenticate();

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const loadingMessage = () => {
        return (
            loading &&(
                <div className="alert alert-info">
                    <h2> Loading....   </h2>
                </div>
                )
        );
    }

    const errorMessage = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    const onSubmit = event => {
        event.preventDefault()
        setValues({ ...values, error: false, loading: true })
        signin({ email, password })
            .then(data => {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false })
                }
                else {
                    authenticate(data, () => {
                        setValues({
                            ...values,
                            didRedirect: true
                        })
                        
                    })
                }
            })
            .catch(console.log("Error in signin"))
    }

    const performRedirect = () => {
        if (didRedirect) {
            
            if (user && user.role === 1) {
                return <Redirect to = "/admin/dashboard" />
            }
            else {
                return <Redirect to="/user/dashboard" />
            }
        }
        if (isAuthenticate()) {
            return <Redirect to="/" />;
        }
    }

    const signInForm = () => {
        return (
            <div className="row">
                <div className="col-md-6 offset-sm-3 text-left">
                    <form>
                        <div className="form-group">
                            <label className="text-light">Email</label>
                            <input onChange={handleChange("email")} className="form-control" value={email} type="email" />
                        </div>

                        <div className="form-group">
                            <label className="text-light">Password</label>
                            <input onChange={handleChange("password")} className="form-control" value={password} type="password" />
                        </div>
                        <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <Base title="Signin Page">
            {loadingMessage()}
            {errorMessage()}
            {performRedirect()}
            {signInForm()}
            <p className="text-white text-center">{JSON.stringify(values)}</p>
        </Base>
    );
};

export default Signin;