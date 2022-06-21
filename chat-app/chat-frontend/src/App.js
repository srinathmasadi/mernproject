
import { Fragment } from 'react';
import { Route } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage'

function App() {
  return (
    <Fragment>
      <div className='App'>
        <Route path='/' component={HomePage} exact/>
        <Route path='/chats' component={ChatPage} />
      </div>
    </Fragment>
  );
}

export default App;
