import styles from "./CommentList.module.css";
import Comment from "../Comment/Comment";

function CommentList({ comments }) {
  return (
    <div className={styles.commentListWrap}>
      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <div className={styles.noComments}>No comments posted</div>
        ) : (
          comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentList;