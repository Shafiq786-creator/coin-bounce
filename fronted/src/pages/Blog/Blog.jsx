import { useEffect, useState } from 'react';
import styles from './Blog.module.css'
import { getAllblogs } from '../../api/internal';
import Loader from '../../components/Loader/Loader';
import { useNavigate } from 'react-router-dom';

function Blog() {
    const navigate = useNavigate();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async function getAllBlogApiCall() {

            try {
                const response = await getAllblogs();

                if (response && response.status === 200) {
                    setBlogs(response.data.blogs)
                } else {
                    setError('failed to fetch blogs.');
                }


            } catch (error) {
                setError('Error fetching blogs.')
                console.error(error);
            } finally {
                setLoading(false);
            }
        })();

        setBlogs([]);
    }, []);


    if (loading) {
        return <Loader text='blogs' />
    }

    if (error) {
        return <div>{error}</div>
    }
    return (
        <div className={styles.blogswraper}>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div
                        key={blog._id}
                        className={styles.blog}
                        onClick={() => navigate(`/blog/${blog._id}`)}
                    >
                        <h1>{blog.title}</h1>
                        <img src={blog.photo} alt={blog.title} />
                        <p>{blog.content}</p>
                    </div>
                ))
            ) : (
                <div className={styles.noblog}>No blogs available.</div>
            )}
        </div>
    )
}

export default Blog;