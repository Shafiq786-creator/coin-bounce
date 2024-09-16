import { useEffect, useState } from 'react';
import styles from './BlogDetails.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader/Loader';
import { deleteBlog, getBlogById, getCommentsById, postComment } from '../../api/internal';
import CommentList from '../../components/CommentList/CommentList';

function BlogDetails() {
    const [blog, setBlog] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [reload, setReload] = useState(false);

    const navigate = useNavigate();

    const params = useParams();
    const blogId = params.id;

    const username = useSelector(state => state.user.username);
    const userId = useSelector(state => state.user._id);

    useEffect(() => {
        async function getBlogDetails() {
          const commentResponse = await getCommentsById(blogId);
          if (commentResponse.status === 200) {
            setComments(commentResponse.data.data);
          }
    
          const blogResponse = await getBlogById(blogId);
          if (blogResponse.status === 200) {
            // set ownership
            setBlog(blogResponse.data.blog);
          }
        }
        getBlogDetails();
      }, [reload]);
    

    const postCommentHander = async () => {
        const data = {
          author: userId,
          blog: blogId,
          content: newComment,
        };
    
        const response = await postComment(data);
    
        if (response.status === 201) {
          setNewComment("");
          setReload(!reload);
        }
      };

      const blogDeleteHandler = async () => {
        const response = await deleteBlog(blogId);
    
        if (response.status === 200) {
          navigate("/");
        }
      };
    
      if (blog.length === 0) {
        return <Loader text="blog details" />;
      }
    

    return (
        <div className={styles.detailswrap}>
            <div className={styles.left}>
               <h1 className={styles.title}>{blog.title}</h1>
               <div className={styles.metadata}>
                  <p>@{blog.author + "on" + new Date(blog.createdAt).toDateString()}</p>
               </div>
               <div className={styles.image}>
                <img src={blog.photo} alt={blog.title} width={250} height={250}/>
               </div>
               <p className={styles.content}>{blog.content}</p>
               
                    <div className={styles.control}>
                        <button className={styles.edit} onClick={() =>{navigate(`/blog/update/${blog._id}`)}}>
                           Edit
                        </button>

                        <button className={styles.delete} onClick={blogDeleteHandler}>
                           Delete
                        </button>
                    </div>
               
            </div>
            <div className={styles.right}>
                <div className={styles.comments}></div>
                  <CommentList comments={comments} />
                  <div className={styles.postcomment}>
                    <input 
                       className={styles.input}
                       placeholder='comments goes here...'
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button 
                    className={styles.postbtn}
                    onClick={postCommentHander}
                    >
                       Post
                    </button>
                  </div>
            </div>
        </div>
    )
}
export default BlogDetails;