
import { Fragment,lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
const ChatPage =lazy(()=>import('./pages/ChatPage')) ;
const HomePage =lazy(()=>import('./pages/HomePage')) ;

function App() {
  return (
    <Fragment>
      <div className='App'>
        <Suspense fallback={<div>Loading...</div>}>
          <Route path='/' component={HomePage} exact/>
          <Route path='/chats' component={ChatPage} />
        </Suspense> 
      </div>
    </Fragment>
  );
}

export default App;
