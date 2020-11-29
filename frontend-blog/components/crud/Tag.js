const { useState, useEffect } = require("react");
import Link from 'next/link'
import Router from 'next/router'
import { createTag, getTags, removeTag } from '../../actions/tag';
const { getCookie } = require("../../actions/auth");

const Tag = () => {

    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        tags: [],
        removed: false,
        reload: false,
    });

    const { name, error, success, tags , removed, reload } = values;
    const token = getCookie('token');




    const showTags = () => {
        return tags.map((c, i) => {
            return (
                <button onDoubleClick={() => deleteConfirm(c.slug)} title="Double click to delete" key={i} className="btn btn-outline-primary mt-1 ml-1 mt-3">
                    {c.name}
                </button>
            );
        });
    }

    const deleteConfirm = slug => {
        let answer = window.confirm('Are you sure! you want to delete this category? ')
        if (answer) {
            deleteTag(slug)
        }
    }

    const deleteTag = slug => {
        removeTag(slug, token).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    error: false,
                    success: false,
                    name: '',
                    removed: !removed,
                    reload: !reload,
                });
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        createTag({ name }, token).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    error: false,
                    success: true,
                    name: '',
                    removed: '',
                    reload: !reload,
                });
            }
        });
    };

    useEffect(() => {
        loadTags();
    }, [reload]);

    const loadTags = () => {
        getTags().then((data) => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({ ...values, tags: data });
            }
        });
    };


    const handleChange = (e) => {
        setValues({
            ...values,
            name: e.target.value,
            error: false,
            success: false,
            removed: '',
        });
    };


    const showSuccess = () => {
        if (success) {
            return <p className="text-success"> Tag is created </p>
        }
    }

    const showError = () => {
        if (error) {
            return <p className="text-danger"> Tag is already exist </p>
        }
    }

    const showRemove = () => {
        if (removed) {
            return <p className="text-success"> Tag is removed </p>
        }
    }

    const mouseMoveHandler = e => {
        setValues({ ...values, error: false, success: false, removed: '' });
    }

    const newTagForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input type="text" className="form-control" onChange={handleChange} value={name} required />
            </div>
            <div>
                <button type="submit" className="btn btn-primary">
                    Create
                </button>
            </div>
        </form>
    )
    return <>
        {showError()}
        {showSuccess()}
        {showRemove()}
        <div onMouseMove={mouseMoveHandler}>
            {newTagForm()}
            {showTags()}
        </div>
    </>
}

export default Tag;
