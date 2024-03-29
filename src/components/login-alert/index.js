import { memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function LoginAlert({text, children, t}) {
  const navigate = useNavigate()
  const location = useLocation();
  return (
    <p>
      <button style={{
      border: 'none',
      backgroundColor: 'transparent',
      color: 'rgb(0, 135, 233)',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '0'
    }} onClick={() => navigate('/login', {state: {back: location.pathname}})}>
        {t('comments.signIn')}
    </button>, {t("comments.possibility")} {text} {children}
    </p>
  )
}

export default memo(LoginAlert)