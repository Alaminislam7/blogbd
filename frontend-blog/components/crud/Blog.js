import Link from 'next/link'
import { useState, useEffect } from 'react'
import Router from 'next/router';
import dynamic from 'next/dynamic'
import { withRouter } from 'next/router'
import { getCookie, isAuth } from '../../actions/auth'
import { getCategories } from '../../actions/category'
import { getTags } from '../../actions/tag'
import { createBlog } from '../../actions/blog'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import '../../node_modules/react-quill/dist/quill.snow.css'
import { QuillFormats, QuillModules } from '../../helpers/quill';


const CreateBlog = ({ router }) => {
    const blogFromLS = () => {
        if (typeof window === 'undefined') {
            return false;
        }

        if (localStorage.getItem('blog')) {
            return JSON.parse(localStorage.getItem('blog'));
        } else {
            return false;
        }
    };

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [checkedCategories, setCheckedCategories] = useState([]);
    const [checkedTags, setCheckedTags] = useState([]);
    const [body, setBody] = useState(blogFromLS())
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishBtn: false,
    });


    const { error, sizeError, success, formData, title, hidePublishBtn } = values;

    const token = getCookie('token')

    // when the component mounts, formData is ready to use
    useEffect(() => {
        setValues({ ...values, formData: new FormData() });
        initCategories();
        initTags();
    }, [router]);

    // initialize categories state
    const initCategories = () => {
        getCategories().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setCategories(data);
            }
        });
    };

    // initialize tags state
    const initTags = () => {
        getTags().then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setTags(data);
            }
        });
    };

    const publishBlog = (e) => {
        e.preventDefault();
        createBlog(formData, token).then((data) => {
            if (data.error) {
                setValues({ ...values, error: data.error });
            } else {
                setValues({
                    ...values,
                    title: '',
                    error: '',
                    success: `A new blog titled "${data.title}" was created`,
                });
                setBody('');
                setCategories([]);
                setTags([]);
            }
        });
    };

    // populate form data and update the state
    const handleChange = (name) => (e) => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        // form data to be processed by the backend to create a new blog
        formData.set(name, value);
        setValues({ ...values, [name]: value, formData, error: '' });
    };

    const handleBody = (e) => {
        // console.log(e);
        // push the event into body
        setBody(e);

        // populate form data
        formData.set('body', e);

        // save to local storage to prevent data loss on page refresh
        if (typeof window !== 'undefined') {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    };

    const showCategories = () => {
        return (
            categories && categories.map((c, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleCategoryToggleCheckbox(c._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{c.name}</label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((t, i) => (
                <li key={i} className="list-unstyled">
                    <input onChange={handleTagToggleCheckbox(t._id)} type="checkbox" className="mr-2" />
                    <label className="form-check-label">{t.name}</label>
                </li>
            ))
        )
    }


    // add or remove checked categories from state
    const handleCategoryToggleCheckbox = (categoryId) => () => {
        setValues({ ...values, error: '' });

        const allCheckedCategories = [...checkedCategories];

        // get the index of current checked category
        const checkedCategory = checkedCategories.indexOf(categoryId);

        // if the current checked category is not in the state, add it
        // else remove the category from the state
        if (checkedCategory === -1) {
            allCheckedCategories.push(categoryId);
        } else {
            allCheckedCategories.splice(checkedCategory, 1);
        }

        setCheckedCategories(allCheckedCategories);
        formData.set('categories', allCheckedCategories);

        console.log(allCheckedCategories);
    };

    // add or remove checked tags from state
    const handleTagToggleCheckbox = (tagId) => () => {
        setValues({ ...values, error: '' });

        const allCheckedTags = [...checkedTags];

        // get the index of current checked tag
        const checkedTag = checkedTags.indexOf(tagId);

        // if the current checked tag is not in the state, add it
        // else remove the tag from the state
        if (checkedTag === -1) {
            allCheckedTags.push(tagId);
        } else {
            allCheckedTags.splice(checkedTag, 1);
        }

        setCheckedTags(allCheckedTags);
        formData.set('tags', allCheckedTags);

        console.log(allCheckedTags);
    };

    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
            {success}
        </div>
    )


    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-group">
                    <label className="text-muted">Title</label>
                    <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
                </div>

                <div className="form-group">
                    <ReactQuill modules={QuillModules} formats={QuillFormats} value={body} placeholder="Write something amazing..." onChange={handleBody} />
                </div>

                <button type='submit' className='btn btn-primary'>
                    PUBLISH
                </button>
            </form>
        )
    }

    return (
        <div className="container-fluid pb-5">
            <div className="row">
                <div className="col-md-8">
                {createBlogForm()}
                <div className='pt-3'>
                    {showError()}
                    {showSuccess()}
                </div>
                </div>
                <div className="col-md-4">
                    <div>
                        <h5>
                            Featured Image
                        </h5>
                        <hr/>
                        <small className='text-muted'>Max Size: 1MB</small>
                        <label className='btn btn-outline-info'>
                            Upload Image
                            <input
                                onChange={handleChange('photo')}
                                type='file'
                                accept='image/*'
                                hidden
                            />
                        </label>
                        
                    </div>
                    <div>
                        <h5>Categories</h5>
                        <hr />
                        <ul style={{ maxHeight: '200px', overflowY: 'scrollY' }}>{showCategories()}</ul>
                    </div>
                    <div>
                        <h5>Tags</h5>
                        <hr />
                        <ul style={{ maxHeight: '200px', overflowY: 'scrollY' }}>{showTags()}</ul>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default withRouter(CreateBlog);