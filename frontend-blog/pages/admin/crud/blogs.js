import Link from 'next/link';
import Admin from '../../../components/auth/Admin/Admin';
import BlogRead from '../../../components/crud/BlogRead';
import Layout from '../../../components/Layout';

const Blog = () => {
    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 pt-5 pb-5">
                            <h2>Manage Blog</h2>
                        </div>
                        <div className="col-md-12">
                            <BlogRead/>
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    )
}

export default Blog;
