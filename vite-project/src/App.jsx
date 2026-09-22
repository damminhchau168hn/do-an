import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <>
      <Header />
      <main className="wrap" style={{ padding: '40px 0', minHeight: '60vh' }}>
        <p>Nội dung trang sẽ nằm ở đây.</p>
      </main>
      <Footer />
    </>
  );
}

export default App;