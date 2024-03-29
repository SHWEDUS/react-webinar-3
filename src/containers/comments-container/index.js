import {memo, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import shallowequal from 'shallowequal'
import CommentItem from '../../components/comment-item'
import CommentsBlock from '../../components/comments-block'
import useInit from '../../hooks/use-init'
import useSelectorStore from '../../hooks/use-selector'
import useTranslate from '../../hooks/use-translate';
import useStore from '../../hooks/use-store';
import commentsActions from '../../store-redux/comments/actions'
import modalsActions from '../../store-redux/modals/actions'
import { filterListByParent } from '../../utils/filter-list-by-parent'

function CommentsContainer() {

  const store = useStore();
  const dispatch = useDispatch();

  const params = useParams();

  useInit(() => {
    dispatch(commentsActions.load(params.id))
  }, [params.id]);

  const { token, exists, user } = useSelectorStore(state => state.session)

  const select = useSelector(state => ({
    comments: state.comments.data,
    formOpen: state.modals.textarea,
  }), shallowequal); // Нужно указать функцию для сравнения свойства объекта, так как хуком вернули объект

  const callbacks = {
    sendComment: useCallback((data) => {
      dispatch(commentsActions.sendComment(data, token)
      )}, [token, params.id]),
    openForm: useCallback((_id) => {
      dispatch(modalsActions.openTextArea(`textarea_${_id}`))
    }, [store]),
    closeForm: useCallback((_id) => dispatch(modalsActions.closeTextArea()), [store]),
    sendReply: useCallback((data) => {
      dispatch(commentsActions.sendReply(data, token))
    }, [token, params.id])
  }

  const {t, language} = useTranslate();
  const renders = {
    item: useCallback(item => (
      <CommentItem
        item={item}
        exists={exists}
        isFormOpen={select.formOpen}
        setOpen={callbacks.openForm}
        setClose={callbacks.closeForm}
        sendReply={callbacks.sendReply}
        depth={1}
        user={user._id}
        t={t}
        language={language}
      />
    ), [t, exists, select.formOpen, language]),
  };

  const options = {
    comments: select.comments.items && filterListByParent(select.comments.items, params.id)
  }

  return (
    <CommentsBlock
      count={select.comments.count}
      articleId={params.id}
      items={options.comments}
      renderItem={renders.item}
      exists={exists}
      sendComment={callbacks.sendComment}
      isFormOpen={select.formOpen}
      t={t}
    />
  )
}

export default memo(CommentsContainer);
