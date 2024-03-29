import { memo, useState } from 'react'
import PropTypes from 'prop-types';
import './style.css';
import { isEmptyOrSpaces } from '../../utils/is-empty-or-spaces'
import LoginAlert from '../login-alert'
import TextArea from '../textarea'

function CommentsBlock({count, articleId, items, renderItem, exists, sendComment, isFormOpen, t}) {
  const [commentValue, setCommentValue] = useState('')
  if (!items) {
    return ;
  }


  const onChangeComment = (value) => {
    setCommentValue(value)
  }

  const onSend = () => {
    !isEmptyOrSpaces(commentValue) && sendComment({
      text: commentValue,
      parent: {
        _id: articleId,
        _type: 'article'
      }
    })
    setCommentValue('')
  }

  return (
    <div className='CommentsBlock'>
      <h2>{t('comments.title')} ({count})</h2>
      {items.map(item => (
        <div className='CommentsBlock-items' key={item._id}>
          {renderItem(item)}
        </div>
      ))}
      {isFormOpen === `textarea` && exists && (
        <TextArea placeholder={'Напишите свой комментарий'} value={commentValue} onChange={onChangeComment} label={'Новый комментарий'}>
          <button className={'CommentsBlock-btn'} onClick={onSend}>Отправить</button>
        </TextArea>
      )}
      {isFormOpen === `textarea` && !exists &&(
        <LoginAlert text={'комментировать.'} t={t}/>
      )}
    </div>
  )
}

CommentsBlock.propTypes = {
  onAdd: PropTypes.func
};

CommentsBlock.defaultProps = {
  onAdd: () => {
  }
}

export default memo(CommentsBlock);
