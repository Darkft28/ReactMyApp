import Header from './components/Header/Header';

function app({truc}: {truc: string}) {
  return (
    <div className="App">
      <Header />
      <h1>Hello World</h1>
      <p>{truc}</p>
    </div>
  );
}

export default app;
