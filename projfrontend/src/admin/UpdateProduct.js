import React, { useState, useEffect } from 'react';
import Base from '../core/Base';
import { Link } from 'react-router-dom';
import { getCategories, getProduct, updateProduct } from './helper/adminapicall';
import { isAuthenticate } from '../auth/helper';


const UpdateProduct = ({ match }) => {

    const { user, token } = isAuthenticate()

    const [values, setValues] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        photo: "",
        categories: [],
        category: "",
        loading: false,
        error: "",
        createdProduct: "",
        getaRedirect: false,
        formData: ""
    });

    const { name, description, price, stock, categories, category, loading, error, createdProduct, getaRedirect, formData } = values;

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

    const preload = (productId) => {
        getProduct(productId).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                preloadCategories()
                setValues({
                    ...values,
                    name: data.name,
                    description: data.description,
                    price: data.price,
                    category: data.category._id,
                    stock: data.stock,
                    formData: new FormData(),
                    
                })
               
            }
        })
    }

    useEffect(() => {
        preload(match.params.productId)
    }, [])

    const onSubmit = (event) => {
        event.preventDefault()
        setValues({ ...values, error: "", loading: true })

        updateProduct(match.params.productId, user._id, token, formData).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error })
            }
            else {
                setValues({
                    ...values,
                    name: "",
                    description: "",
                    price: "",
                    stock: "",
                    photo: "",
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
            <span>Post photo</span>
            <div className="form-group">
                <label className="btn btn-block btn-success">
                    <input
                        onChange={handleChange("photo")}
                        type="file"
                        name="photo"
                        accept="image"
                        placeholder="choose a file"
                    />
                </label>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("name")}
                    name="name"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                />
            </div>
            <div className="form-group">
                <textarea
                    onChange={handleChange("description")}
                    name="description"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                />
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("price")}
                    type="number"
                    className="form-control"
                    placeholder="Price"
                    value={price}
                />
            </div>
            <div className="form-group">
                <select
                    onChange={handleChange("category")}
                    className="form-control"
                    placeholder="Category"
                >
                    <option>Select</option>
                    {categories &&
                        categories.map((cate, index) => (
                            <option key={index} value={cate._id}>{cate.name}</option>
                        ))}
                </select>
            </div>
            <div className="form-group">
                <input
                    onChange={handleChange("stock")}
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    value={stock}
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
                </div>
            </div>
        </Base>
    );
}


export default UpdateProduct;