import { memo, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import {cn as bem} from '@bem-react/classname';
import { formatDate } from '../../utils/formatted-date'
import './style.css';
import { isEmptyOrSpaces } from '../../utils/is-empty-or-spaces'
import LoginAlert from '../login-alert'
import TextArea from '../textarea'

function CommentItem(props) {
  const [value, setValue] = useState('')
  const textarea = useRef(null)
  const cn = bem('CommentItem');
  const sendReply = (id) => {
    !isEmptyOrSpaces(value) && props.sendReply({
      text: value,
      parent: {
        _id: id,
        _type: 'comment'
      }
    })
    props.setClose(id)
    setValue('')
  }

  const setReply = (value) => {
    setValue(value)
  }

  const setFormClose = (id) => {
    props.setClose(id)
  }

  const setFormOpen = (id) => {
    props.setOpen(id)
  }

  console.log(props.language)

  useEffect(() => {
    textarea.current && textarea.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
  }, [props.isFormOpen])

  const marginLeft = props.depth <= 10 && props.depth !== 1 ? 30 : 0;
  return (
    <>
      <div className={cn()} style={{marginLeft: `${marginLeft}px`}}>
        <div className={cn('block')}>
          <div className={cn('title')}>
            <b className={props.item.author._id === props.user ? cn('title__author') : ''}>{props.item.author?.profile?.name}</b>
            <span>{formatDate(props.item?.dateCreate, props.language)}</span>
          </div>
          <div className={cn('content')}>
            <p>{props.item?.text}</p>
          </div>
          <button className={cn('link')} onClick={() => setFormOpen(props.item._id)}>{props.t('comments.reply')}</button>
        </div>

        {props.item.replies?.map(reply => (
            <CommentItem
              key={reply._id}
              item={reply}
              exists={props.exists}
              isFormOpen={props.isFormOpen}
              setOpen={props.setOpen}
              setClose={props.setClose}
              sendReply={props.sendReply}
              depth={props.depth + 1}
              user={props.user}
              t={props.t}
              language={props.language}
            />
          ))}
      </div>
      {props.isFormOpen === `textarea_${props.item._id}` && props.exists && (
        <div ref={textarea} className={cn('reply')} style={{marginLeft: `${marginLeft + 30}px`}}>
          <TextArea label={props.t('comments.newReply')} value={value} placeholder={props.t('comments.placeholder')} onChange={setReply}>
            <div className={cn('reply__btns')}>
              <button onClick={() => sendReply(props.item._id)}>{props.t('comments.send')}</button>
              <button onClick={() => setFormClose(props.item._id)}>{props.t('comments.cancel')}</button>
            </div>
          </TextArea>
        </div>
      )}
      {props.isFormOpen === `textarea_${props.item._id}` && !props.exists &&(
        <LoginAlert text={props.t('comments.replyText')} t={props.t}>
          <button ref={textarea} className={cn('link__cancel')} onClick={() => setFormClose(props.item._id)}>{props.t('comments.cancel')}</button>
        </LoginAlert>
      )}
    </>
  );
}

CommentItem.propTypes = {
  item: PropTypes.shape({
    author: PropTypes.shape({
      profile: PropTypes.shape({
        name: PropTypes.string
      }),
    }),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    dateCreate: PropTypes.string,
    isDeleted: PropTypes.bool,
    parent: PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      _type: PropTypes.string
    }),
    text: PropTypes.string,
  }).isRequired,
};

CommentItem.defaultProps = {
}

export default memo(CommentItem);
