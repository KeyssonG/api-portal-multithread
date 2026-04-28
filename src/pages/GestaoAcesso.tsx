import Header from "../components/Header";
import Footer from "../components/Footer";
import LinkModuloForm from "../components/LinkModuloForm";

const GestaoAcesso = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f4f7fa' }}>
      <Header />
      <main style={{ flex: 1, padding: '100px 2rem 40px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <LinkModuloForm
          onSuccess={() => {}}
          onError={() => {}}
        />
      </main>
      <Footer />
    </div>
  );
};

export default GestaoAcesso;
