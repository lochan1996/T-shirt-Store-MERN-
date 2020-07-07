import React, { useState, useEffect } from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import { getCategories, getProduct, updateProduct, getaCategory, updateCategory } from './helper/adminapicall';
import { isAuthenticate } from '../auth/helper';


const UpdateCategory = ({ match }) => {

    const { user, token } = isAuthenticate()

    const [values, setValues] = useState({
        name: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getaRedirect: false,
        formData: ""
    });

    const { name, categories, category, loading, error, createdProduct, getaRedirect, formData } = values;

    const preloadCategories = () => {
        getCategories().then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({
                    categories: data,
                    formData: new FormData()
                })
            }
        })
    }

    const preload = (categoryId) => {
        console.log(match.params.categoryId)
        getaCategory(categoryId).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                preloadCategories()
                setValues({
                    ...values,
                    name: data.name,
                   //category: data.category._id,
                    formData: new FormData()

                })

            }
        })
    }

    useEffect(() => {
        preload(match.params.categoryId)
    }, [])

    const onSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, error: "", loading: true })

        updateCategory(match.params.categoryId, user._id, token, formData).then(data => {

            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({
                    ...values,
                    name: "",
                    
                    loading: false,
                    createdProduct: data.name,

                })
            }
        })
    };

    const handleChange = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value
        formData.set(name, value)
        setValues({ ...values, [name]: value })
    };

    const successMessage = () => (
        <div className="alert alert-success mt-3" style={{ display: createdProduct ? "" : "none" }}>
            {createdProduct} Updated Successfully
        </div>
    );

    //create a error message and JS CODE for loading (use loading var)for 2 sec after success redirect(use getaRedirect var) to admin dashboard

    /*const warningMessage = () => {
        if (error) {
            return <h4 className="text-success">Failed to create category</h4>;
        }
    };*/

    const createProductForm = () => (
        <form >
            
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="photo"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            
          

            <button type="submit" onClick={onSubmit} className="btn btn-outline-success">
                Update Product
      </button>
        </form>
    );

    return (
        <Base title="Update products Here!" description="Update your products" className="container bg-info p-4">
            <Link className="btn btn-sm btn-dark mb-3" to="/admin/dashboard">
                Admin Home
            </Link>
            <div className="row bg-dark text-white rounded">
                <div className="col-md-8 offset-md-2">
                    {successMessage()}
                    {createProductForm()}
                    <p className="text-white text-center">{JSON.stringify(values)}</p>
                </div>
            </div>
        </Base>
    );
}


export default UpdateCategory;