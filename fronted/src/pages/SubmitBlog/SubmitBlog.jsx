import { useState } from "react";
import { useSelector } from "react-redux";
import styles from './SubmitBlog.module.css';
import Textinput from '../../components/Textinput/Textinput';
import { useNavigate } from "react-router-dom";
import { submitBlog } from "../../api/internal";
import Loader from '../../components/Loader/Loader';


function SubmitBlog() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const author = useSelector(state => state.user._id);

    const getPhoto = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPhoto(reader.result);
        }
    }

    const submitHandler = async () => {
        setIsSubmitting(true);
        setError('');

        const data = {
            author, title, content, photo
        };

        const response = await submitBlog(data);

        if (response.status === 201) {
            navigate('/blogs');
        } else {
            setError('Failed to submit the blog. Please try again.');
        }

        setIsSubmitting(false);
    }
    return (
        <div className={styles.submitwrapper}>
            <div className={styles.header}>Create a Blog!</div>
            {error && <div className={styles.error}>{error}</div>}
            <Textinput
                type='text'
                name='title'
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '60%' }}
            />

            <textarea
                className={styles.content}
                placeholder="your content goes here..."
                maxLength={1000}
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className={styles.photoprompt}>
                <p>Choose a photo</p>
                <input
                    type="file"
                    name="photo"
                    id="photo"
                    accept="image/jpg, image/jpeg, image/png"
                    onChange={getPhoto}
                />
                {photo !== '' ? <img src={photo} width={100} height={100} /> : ''}
            </div>

            

            <button
                className={styles.submit}
                onClick={submitHandler}
                disabled={title === '' || content === '' || photo === ''}
            >
                 {isSubmitting ? <Loader text="Submitting..." /> : 'Submit'}
            </button>

        </div>
    )
}

export default SubmitBlog;