import Link from 'next/link';
import Admin from '../../../components/auth/Admin/Admin';
import BlogCreate from '../../../components/crud/Blog';
import Layout from '../../../components/Layout';

const Blog = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Create a new Blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogCreate/>
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    )
}

export default Blog;
